import React, { ChangeEvent, useState } from "react";

import './Registration.css';

function RegistrationForm() {
    interface IFormState {
      username: string;
      password: string;
      passwordConfirm: string;
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
        phoneNumber: string;
      };
      [key: string]: any; // To make TypeScript accept dynamic properties
    }
  
    const initialFormState: IFormState = {
      username: '',
      password: '',
      passwordConfirm: '',
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
        phoneNumber: '',
      }
    };
  
    const [formState, setFormState] = useState<IFormState>(initialFormState);
  

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

    const submitForm = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      // send formState to your server
      console.log(formState);
    };
  
    return (
      <div>
        <h1>Registration Form</h1>
        <form onSubmit={submitForm}>
          {/* Create fields for username, password, etc. */}
          <label>Username (Email): <input type='email' name='username' value={formState.username} onChange={handleInputChange} required /></label>
          <label>Password: <input type='password' name='password' value={formState.password} onChange={handleInputChange} required /></label>
          <label>Confirm Password: <input type='password' name='passwordConfirm' value={formState.passwordConfirm} onChange={handleInputChange} required /></label>
          <label>First Name: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange} required /></label>
          <label>Last Name: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange} required /></label>
          {/* Create fields for shippingAddress */}
          <label>Shipping Address - Name: <input type='text' name='shippingAddress.name' value={formState.shippingAddress.name} onChange={handleInputChange} required /></label>
          <label>Country: <input type='text' name='shippingAddress.country' value={formState.shippingAddress.country} onChange={handleInputChange} required /></label>
          <label>City: <input type='text' name='shippingAddress.city' value={formState.shippingAddress.city} onChange={handleInputChange} required /></label>
          <label>Street: <input type='text' name='shippingAddress.street' value={formState.shippingAddress.street} onChange={handleInputChange} required /></label>
          <label>Zip: <input type='text' name='shippingAddress.zip' value={formState.shippingAddress.zip} onChange={handleInputChange} required /></label>
          <label>Phone Number:  <input type='text' name='shippingAddress.phoneNumber' value={formState.shippingAddress.phoneNumber} onChange={handleInputChange} required /></label>
          {/* Create fields for billingAddress */}
          <label>Billing Address - Name: <input type='text' name='billingAddress.name' value={formState.billingAddress.name} onChange={handleInputChange} required /></label>
          <label>Country: <input type='text' name='billingAddress.country' value={formState.billingAddress.country} onChange={handleInputChange} required /></label>
          <label>City: <input type='text' name='billingAddress.city' value={formState.billingAddress.city} onChange={handleInputChange} required /></label>
          <label>Street: <input type='text' name='billingAddress.street' value={formState.billingAddress.street} onChange={handleInputChange} required /></label>
          <label>Zip: <input type='text' name='billingAddress.zip' value={formState.billingAddress.zip} onChange={handleInputChange} required /></label>
          <label>Phone Number:  <input type='text' name='billingAddress.phoneNumber' value={formState.billingAddress.phoneNumber} onChange={handleInputChange} required /></label>
          <button type='submit'>Register</button>
        </form>
      </div>
    );
  }

export default RegistrationForm;
