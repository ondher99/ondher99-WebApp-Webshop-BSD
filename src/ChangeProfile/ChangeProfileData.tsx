import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, getUsers } from '../Profile/UserContext';
import { ToastContainer, toast } from 'react-toastify';

const ChangeProfileDataForm = () => {
  interface IFormState {
    firstName: string;
    lastName: string;
    shippingAddress: {
      name: string;
      country: string;
      city: string;
      street: string;
      zip: string;
      phoneNumber: string;
    };
    billingAddress: {
      name: string;
      country: string;
      city: string;
      street: string;
      zip: string;
      taxNumber?: string;
    };
    [key: string]: any;
  }

    const initialFormState = {
      firstName: '',
      lastName: '',
      shippingAddress: {
        name: '',
        country: '',
        city: '',
        street: '',
        zip: '',
        phoneNumber: '',
      },
      billingAddress: {
        name: '',
        country: '',
        city: '',
        street: '',
        zip: '',
        taxNumber: '',
      }
    };

    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [formState, setFormState] = useState<IFormState>(initialFormState);
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [taxNumberError, setTaxNumberError] = useState('');
    
      const fetchAndUpdateUserData = useCallback(async () => {
        try {
          const userData = await getUsers();
          setUser(userData);
          setFormState({
            firstName: userData.firstName,
            lastName: userData.lastName,
            shippingAddress: userData.shippingAddress,
            billingAddress: userData.billingAddress,
          });
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            toast.error('Your session has expired. Please log in again.');
            setUser(null);
            localStorage.removeItem('accessToken');
            navigate('/login');
          } else {
            toast.error('An error occurred while fetching profile data.');
            console.error('Failed to fetch user:', error);
          }
        }
      }, [setUser, navigate]);
    
      useEffect(() => {
        if (!user) {
          fetchAndUpdateUserData();
        }
      }, [setUser, user, navigate, fetchAndUpdateUserData]);
    
      const resetForm = () => fetchAndUpdateUserData();

    if (!user) {
      navigate("/")
      return <div>Loading user data...</div>;
    }

    const changeData = async (data = {}) => {
      const authtoken = localStorage.getItem('accessToken');
      if (!authtoken) {
        toast.error('Missing or invalid authorization token - login required.');
        navigate('/login');
        return; // Stop execution if there is no token
      }
    
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authtoken}`
      });
    
      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify(data),
        });
    
        if (response.status === 200) {
          toast.success('Your profile data has been updated successfully.');
          const updatedUserData = await response.json();
          setUser(updatedUserData); // Update user context with new data
          navigate('/profile'); // Redirect to the profile page
        } else if (response.status === 401) {
          // If unauthorized, log the user out and redirect them to the login page
          toast.error('Session expired - please log in again.');
          setUser(null); // Clear the user state
          localStorage.removeItem('accessToken'); // Clear the access token
          navigate('/login');
        } else {
          const errorText = await response.text();
          toast.error(`An error occurred: ${errorText}`);
        }
      } catch (error) {
        toast.error('There was a network error while updating your profile, please try again later.');
        console.error(error);
      }
    };

    const validatePhoneNumber = (phoneNumber: string) => {
      // This regular expression matches international phone numbers beginning with '+' follow by digits
      const regex = /^\+[0-9]+$/;
      if (!regex.test(phoneNumber)) {
          setPhoneNumberError('Invalid phone number format. It should start with a "+" and contain digits only.');
      } else {
          setPhoneNumberError('');
      }
    };

    const validateTaxNumber = (taxNumber: string) => {
      // This regex matches exactly 11 digits
      const regex = /^\d{11}$/;
      if (!regex.test(taxNumber) && taxNumber !== "") {
          setTaxNumberError('Tax number must contain exactly 11 digits.');
      } else {
          setTaxNumberError('');
      }
    };

  const submitForm = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    let formData = { ...formState }; 

    validatePhoneNumber(formState.shippingAddress.phoneNumber);
    if (formState.billingAddress.taxNumber) { // Only validate taxNumber if provided
      validateTaxNumber(formState.billingAddress.taxNumber);
    }

    if (!formData.billingAddress.taxNumber?.trim()) {
      delete formState.billingAddress.taxNumber;
    }

    if (phoneNumberError || taxNumberError) {
      // Do not proceed with form submission if there are errors
      toast.error("Please correct the errors before submitting.");
      return;
    }

    try {
      const response = await changeData(formData);
      console.log(response);
      // If the change was successful, update the user data or show a success message
      const userData = await getUsers();
      if (userData) {
        setUser(userData);
        navigate('/profile');
      } else {
        toast.error('No user data received');
      }
    } catch (error) {
      console.error('There was an error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    if (name.includes('shippingAddress.') || name.includes('billingAddress.')) {
      const [addressType, addressField] = name.split('.');
      setFormState(prevState => ({
        ...prevState,
        [addressType]: {
          ...prevState[addressType as keyof IFormState],
          [addressField]: value
        }
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  return (
    <div>
      <form id="DataChangeForm" onSubmit={submitForm} onReset={resetForm}>
        <h2>Update Profile Data</h2>
        <label>First Name: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange} required /></label>
        <label>Last Name: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange} required /></label>

        <h3>Shipping Address</h3>
        <label>Shipping Address - Name: <input type='text' name='shippingAddress.name' value={formState.shippingAddress.name} onChange={handleInputChange} required /></label>
        <label>Country: <input type='text' name='shippingAddress.country' value={formState.shippingAddress.country} onChange={handleInputChange} required /></label>
        <label>City: <input type='text' name='shippingAddress.city' value={formState.shippingAddress.city} onChange={handleInputChange} required /></label>
        <label>Street: <input type='text' name='shippingAddress.street' value={formState.shippingAddress.street} onChange={handleInputChange} required /></label>
        <label>Zip: <input type='text' name='shippingAddress.zip' value={formState.shippingAddress.zip} onChange={handleInputChange} required /></label>
        <label>Phone Number: <input
          type='text'
          name='shippingAddress.phoneNumber'
          value={formState.shippingAddress.phoneNumber}
          onChange={handleInputChange}
          onBlur={(e) => validatePhoneNumber(e.target.value)}/>
          </label>
          {phoneNumberError && <p style={{color: 'red'}}>{phoneNumberError}</p>}
        <h3>Billing Address</h3>
        <label>Billing Address - Name: <input type='text' name='billingAddress.name' value={formState.billingAddress.name} onChange={handleInputChange} required /></label>
        <label>Country: <input type='text' name='billingAddress.country' value={formState.billingAddress.country} onChange={handleInputChange} required /></label>
        <label>City: <input type='text' name='billingAddress.city' value={formState.billingAddress.city} onChange={handleInputChange} required /></label>
        <label>Street: <input type='text' name='billingAddress.street' value={formState.billingAddress.street} onChange={handleInputChange} required /></label>
        <label>Zip: <input type='text' name='billingAddress.zip' value={formState.billingAddress.zip} onChange={handleInputChange} required /></label>
        <label>Tax Number: <input
          type='text'
          name='billingAddress.taxNumber'
          value={formState.billingAddress.taxNumber}
          onChange={handleInputChange}
          onBlur={(e) => validateTaxNumber(e.target.value)}/>
          </label>
          {taxNumberError && <p style={{color: 'red'}}>{taxNumberError}</p>}
        <button type='reset'>Reset</button>
        <button type='submit'>Update Data</button>
      </form>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
    </div>
  );
}
export default ChangeProfileDataForm