import React, { ChangeEvent, useState } from "react";
import registerUser from "../index";

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
        taxNumber: string;
      };
      [key: string]: any;
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
        taxNumber: '',
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
        
        registerUser('http://localhost:5000/user', formState)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error('There was an error:', error);
          });
      };
  
    return (
      <div>
        <h1>Registration Form</h1>
        <form onSubmit={submitForm}>
          
          <label>Username (Email): <input type='email' name='username' value={formState.username} onChange={handleInputChange} required /></label>
          <label>Password: <input type='password' name='password' value={formState.password} onChange={handleInputChange} required /></label>
          <label>Confirm Password: <input type='password' name='passwordConfirm' value={formState.passwordConfirm} onChange={handleInputChange} required /></label>
          <label>First Name: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange} required /></label>
          <label>Last Name: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange} required /></label>

          <label>Shipping Address - Name: <input type='text' name='shippingAddress.name' value={formState.shippingAddress.name} onChange={handleInputChange} required /></label>
          <label>Country: <input type='text' name='shippingAddress.country' value={formState.shippingAddress.country} onChange={handleInputChange} required /></label>
          <label>City: <input type='text' name='shippingAddress.city' value={formState.shippingAddress.city} onChange={handleInputChange} required /></label>
          <label>Street: <input type='text' name='shippingAddress.street' value={formState.shippingAddress.street} onChange={handleInputChange} required /></label>
          <label>Zip: <input type='text' name='shippingAddress.zip' value={formState.shippingAddress.zip} onChange={handleInputChange} required /></label>
          <label>Phone Number:  <input type='text' name='shippingAddress.phoneNumber' value={formState.shippingAddress.phoneNumber} onChange={handleInputChange} required /></label>

          <label>Billing Address - Name: <input type='text' name='billingAddress.name' value={formState.billingAddress.name} onChange={handleInputChange} required /></label>
          <label>Country: <input type='text' name='billingAddress.country' value={formState.billingAddress.country} onChange={handleInputChange} required /></label>
          <label>City: <input type='text' name='billingAddress.city' value={formState.billingAddress.city} onChange={handleInputChange} required /></label>
          <label>Street: <input type='text' name='billingAddress.street' value={formState.billingAddress.street} onChange={handleInputChange} required /></label>
          <label>Zip: <input type='text' name='billingAddress.zip' value={formState.billingAddress.zip} onChange={handleInputChange} required /></label>
          <label>Tax Number:  <input type='text' name='billingAddress.taxNumber' value={formState.billingAddress.taxNumber} onChange={handleInputChange} required /></label>
          <button type='submit'>Register</button>
        </form>
      </div>
    );
  }

export default RegistrationForm;
