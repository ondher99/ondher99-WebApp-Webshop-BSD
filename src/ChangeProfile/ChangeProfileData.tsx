import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Profile/UserContext';
import { getUsers } from '../index';
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
    if (!user) {
      navigate("/")
      return null;
    }
    if (isLoading) {
      return <div>Loading user data...</div>;
    }
    function changeData(url = "", registerdata = {}) {
      const authtoken = localStorage.getItem('accessToken')
      const myHeaders = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authtoken
      });
      
      return fetch(url, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(registerdata)
      })
      
      .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Hiányzó vagy érvénytelen auth token - belépés szükséges');
          }
        })
        .then(response => {
          console.debug(response);
          return response;
        }).catch(error => {
          console.error(error);
        });
      }
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
      if (!regex.test(taxNumber) && taxNumber != "") {
          setTaxNumberError('Tax number must contain exactly 11 digits.');
      } else {
          setTaxNumberError('');
      }
    };
  const submitForm = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    let formData = formState; 
    if (!formData.billingAddress.taxNumber?.trim()) {
      delete formState.billingAddress.taxNumber;
    }
    changeData('http://localhost:5000/user', formData)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('There was an error:', error);
    });
    const userData = await getUsers()
    if (userData) {
      setUser(userData);
      navigate('/profile');
    } else {
      toast.error('No user data received');
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
  function resetForm(){
    getUsers()
          .then(userData => {
            setUser(userData);
            setIsLoading(false);
            const { firstName, lastName, shippingAddress, billingAddress } = userData;
            setFormState({ firstName, lastName, shippingAddress, billingAddress });
          })
  }
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
      <ToastContainer/>
    </div>
  );
}
export default ChangeProfileDataForm