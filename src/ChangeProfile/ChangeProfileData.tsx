import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Profile/UserContext';
import { getUsers, changeData } from '../index';

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
      taxNumber: string;
    };
    [key: string]: any; // To make TypeScript accept dynamic properties
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
  const submitForm = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    changeData('http://localhost:5000/user', formState)
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
      alert('No user data received');
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
      <form onSubmit={submitForm}>
        <h2>Update Profile Data</h2>
        <label>First Name: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange} required /></label>
        <label>Last Name: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange} required /></label>

        <h3>Shipping Address</h3>
        <label>Shipping Address - Name: <input type='text' name='shippingAddress.name' value={formState.shippingAddress.name} onChange={handleInputChange} required /></label>
        <label>Country: <input type='text' name='shippingAddress.country' value={formState.shippingAddress.country} onChange={handleInputChange} required /></label>
        <label>City: <input type='text' name='shippingAddress.city' value={formState.shippingAddress.city} onChange={handleInputChange} required /></label>
        <label>Street: <input type='text' name='shippingAddress.street' value={formState.shippingAddress.street} onChange={handleInputChange} required /></label>
        <label>Zip: <input type='text' name='shippingAddress.zip' value={formState.shippingAddress.zip} onChange={handleInputChange} required /></label>
        <label>Phone Number:  <input type='text' name='shippingAddress.phoneNumber' value={formState.shippingAddress.phoneNumber} onChange={handleInputChange} required /></label>

        <h3>Billing Address</h3>
        <label>Billing Address - Name: <input type='text' name='billingAddress.name' value={formState.billingAddress.name} onChange={handleInputChange} required /></label>
        <label>Country: <input type='text' name='billingAddress.country' value={formState.billingAddress.country} onChange={handleInputChange} required /></label>
        <label>City: <input type='text' name='billingAddress.city' value={formState.billingAddress.city} onChange={handleInputChange} required /></label>
        <label>Street: <input type='text' name='billingAddress.street' value={formState.billingAddress.street} onChange={handleInputChange} required /></label>          <label>Zip: <input type='text' name='billingAddress.zip' value={formState.billingAddress.city} onChange={handleInputChange} required /></label>
        <label>Tax Number:  <input type='text' name='billingAddress.taxNumber' value={formState.billingAddress.taxNumber} onChange={handleInputChange} required /></label>
        <button type='reset'>Reset</button>
        <button type='submit'>Update Data</button>
      </form>
    </div>
  );
}
export default ChangeProfileDataForm