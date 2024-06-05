import React, { ChangeEvent, useEffect, useState } from 'react';
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
    const [isLoading, setIsLoading] = useState(!user);
    const [formState, setFormState] = useState<IFormState>(initialFormState);
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [taxNumberError, setTaxNumberError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    
    // Shipping address errors
    const [shippingNameError, setShippingNameError] = useState('');
    const [shippingCountryError, setShippingCountryError] = useState('');
    const [shippingCityError, setShippingCityError] = useState('');
    const [shippingStreetError, setShippingStreetError] = useState('');
    const [shippingZipError, setShippingZipError] = useState('');
    
    // Billing address errors
    const [billingNameError, setBillingNameError] = useState('');
    const [billingCountryError, setBillingCountryError] = useState('');
    const [billingCityError, setBillingCityError] = useState('');
    const [billingStreetError, setBillingStreetError] = useState('');
    const [billingZipError, setBillingZipError] = useState('');

    type FieldErrorSetterMap = {
      [key: string]: React.Dispatch<React.SetStateAction<string>>;
    };

    const fieldErrorSetters: FieldErrorSetterMap = {
      firstName: setFirstNameError,
      lastName: setLastNameError,
      'shippingAddress.name': setShippingNameError,
      'shippingAddress.country': setShippingCountryError,
      'shippingAddress.city': setShippingCityError,
      'shippingAddress.street': setShippingStreetError,
      'shippingAddress.zip': setShippingZipError,
      'billingAddress.name': setBillingNameError,
      'billingAddress.country': setBillingCountryError,
      'billingAddress.city': setBillingCityError,
      'billingAddress.street': setBillingStreetError,
      'billingAddress.zip': setBillingZipError,
    };

    const checkIfEmpty = (fieldValue: string, fieldName: string) => {
      const setError = fieldErrorSetters[fieldName];

      if (typeof setError !== 'function') {
        console.error(`setError is not a function for fieldName: ${fieldName}`);
        return;
      }

      if (!fieldValue.trim()) {
        setError(`${fieldName.replace(/\./g, ' ')} is required!`);
      } else {
        setError(''); // Clear the error if the field is not empty
      }
    };
    
      useEffect(() => {
        if (!user) {
          setIsLoading(true);
          getUsers()
            .then(userData => {
              setUser(userData);
              setIsLoading(false);
              const { firstName, lastName, shippingAddress, billingAddress } = userData;
              setFormState({ firstName, lastName, shippingAddress, billingAddress });
            })
            .catch(error => {
              console.error('Failed to fetch user:', error);
              setIsLoading(false);
              navigate('/login');
            });
        } else {
          const { firstName, lastName, shippingAddress, billingAddress } = user;
          setFormState({ firstName, lastName, shippingAddress, billingAddress });
        }
      }, [navigate, setUser, user]);
    
      function resetForm(){
        getUsers()
              .then(userData => {
                setUser(userData);
                setIsLoading(false);
                const { firstName, lastName, shippingAddress, billingAddress } = userData;
                setFormState({ firstName, lastName, shippingAddress, billingAddress });
              })
      }

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

    checkIfEmpty(formState.firstName, 'firstName');
      checkIfEmpty(formState.lastName, 'lastName');
      
      // Nested fields of shippingAddress
      checkIfEmpty(formState.shippingAddress.name, 'shippingAddress.name');
      checkIfEmpty(formState.shippingAddress.country, 'shippingAddress.country');
      checkIfEmpty(formState.shippingAddress.city, 'shippingAddress.city');
      checkIfEmpty(formState.shippingAddress.street, 'shippingAddress.street');
      checkIfEmpty(formState.shippingAddress.zip, 'shippingAddress.zip');
      
      // Nested fields of billingAddress
      checkIfEmpty(formState.billingAddress.name, 'billingAddress.name');
      checkIfEmpty(formState.billingAddress.country, 'billingAddress.country');
      checkIfEmpty(formState.billingAddress.city, 'billingAddress.city');
      checkIfEmpty(formState.billingAddress.street, 'billingAddress.street');
      checkIfEmpty(formState.billingAddress.zip, 'billingAddress.zip');

      const canSubmit = Object.entries(formState).every(([fieldName, fieldValue]) => {
        const hasValue = typeof fieldValue === 'object'
          ? Object.values(fieldValue as Record<string, string>).every(value => value.trim() !== '')  // For nested objects like addresses
          : fieldValue.trim() !== '';  // For top-level fields like username
        
        if (!hasValue) {
          const setError = fieldErrorSetters[fieldName];
          if(setError) {
            setError(fieldName + ' is required');
          }
        }
        
        return hasValue;
      }) &&
        phoneNumberError === "" && // Phone number validation has passed
        taxNumberError === ""; // Tax number validation has passed or the field is empty

    if(canSubmit) {
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
        <label>First Name*: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange}/></label>
          {firstNameError && <p style={{color: 'red'}}>{firstNameError}</p>}
          
          <label>Last Name*: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange}/></label>
          {lastNameError && <p style={{color: 'red'}}>{lastNameError}</p>}

        <h3>Shipping Address</h3>
        <label>Shipping Address - Name*: <input type='text' name='shippingAddress.name' value={formState.shippingAddress.name} onChange={handleInputChange}/></label>
          {shippingNameError && <p style={{color: 'red'}}>{shippingNameError}</p>}
          <label>Country*: <input type='text' name='shippingAddress.country' value={formState.shippingAddress.country} onChange={handleInputChange}/></label>
          {shippingCountryError && <p style={{color: 'red'}}>{shippingCountryError}</p>}
          <label>City*: <input type='text' name='shippingAddress.city' value={formState.shippingAddress.city} onChange={handleInputChange}/></label>
          {shippingCityError && <p style={{color: 'red'}}>{shippingCityError}</p>}
          <label>Street*: <input type='text' name='shippingAddress.street' value={formState.shippingAddress.street} onChange={handleInputChange}/></label>
          {shippingStreetError && <p style={{color: 'red'}}>{shippingStreetError}</p>}
          <label>Zip*: <input type='text' name='shippingAddress.zip' value={formState.shippingAddress.zip} onChange={handleInputChange}/></label>
          {shippingZipError && <p style={{color: 'red'}}>{shippingZipError}</p>}

        <label>Phone Number: <input
          type='text'
          name='shippingAddress.phoneNumber'
          value={formState.shippingAddress.phoneNumber}
          onChange={handleInputChange}
          onBlur={(e) => validatePhoneNumber(e.target.value)}/>
          </label>
          {phoneNumberError && <p style={{color: 'red'}}>{phoneNumberError}</p>}
        <h3>Billing Address</h3>
        <label>Billing Address - Name*: <input type='text' name='billingAddress.name' value={formState.billingAddress.name} onChange={handleInputChange}/></label>
          {billingNameError && <p style={{color: 'red'}}>{billingNameError}</p>}
          <label>Country*: <input type='text' name='billingAddress.country' value={formState.billingAddress.country} onChange={handleInputChange}/></label>
          {billingCountryError && <p style={{color: 'red'}}>{billingCountryError}</p>}
          <label>City*: <input type='text' name='billingAddress.city' value={formState.billingAddress.city} onChange={handleInputChange}/></label>
          {billingCityError && <p style={{color: 'red'}}>{billingCityError}</p>}
          <label>Street*: <input type='text' name='billingAddress.street' value={formState.billingAddress.street} onChange={handleInputChange}/></label>
          {billingStreetError && <p style={{color: 'red'}}>{billingStreetError}</p>}
          <label>Zip*: <input type='text' name='billingAddress.zip' value={formState.billingAddress.zip} onChange={handleInputChange}/></label>
          {billingZipError && <p style={{color: 'red'}}>{billingZipError}</p>}
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