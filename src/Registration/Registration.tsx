import React, { useState } from "react";

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
        taxNumber: '',
      }
    };
  
    const [formState, setFormState] = useState<IFormState>(initialFormState);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [taxNumberError, setTaxNumberError] = useState('');
    const [formError, setFormError] = useState('');
    const [userError, setUserError] = useState('');

    const checkRequiredFields = () => {

      const requiredFields = [
        formState.username,
        formState.password,
        formState.passwordConfirm,
        formState.firstName,
        formState.lastName,
        formState.shippingAddress.name,
        formState.shippingAddress.city,
        formState.shippingAddress.country,
        formState.shippingAddress.street,
        formState.shippingAddress.zip,
        formState.shippingAddress.phoneNumber,
        formState.billingAddress.name,
        formState.billingAddress.city,
        formState.billingAddress.country,
        formState.billingAddress.street,
        formState.billingAddress.zip,
        formState.billingAddress.taxNumber,
      ];
      
      const result = requiredFields.every(field => field.trim() !== '');

      return result;
    };

    async function registerUser(registerdata: IFormState) {
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
      });
    
      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(registerdata)
        });
        
      console.log(registerdata);
      console.log(response.status);
      
        if (response.status === 201) {
          const data = await response.json();
          console.debug(data);
          setUserError('');
          return data;
        }
        if (response.status === 409) {
          setUserError('Existing User!')
        }
        if (response.status === 400) {
          setUserError('Bad Request: Check if user data is correct');
        } else {
          throw new Error('There was an error!');
        }
      } catch(error) {
        console.error(error);
      }
    }

    function validateEmail(inputEmail: string) {
      const regex = /^\S+@\S+\.\S+$/;
      if(!regex.test(inputEmail)){
          setEmailError('Invalid email format');
          return false;
      }
      setEmailError('');
      return true;
    }

    function ValidatePassword(inputPassword: string) {
      const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if(!regex.test(inputPassword)){
        setPasswordError('Invalid password format');
        return false;
    }
    setPasswordError('');
    return true;
    }

    const handlePasswordMismatch = () => {
      if (formState.password !== formState.passwordConfirm) {
        setPasswordConfirmError('Password and Confirm Password do not match.');
      } else {
        setPasswordConfirmError('');
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
      if (!regex.test(taxNumber)) {
          setTaxNumberError('Tax number must contain exactly 11 digits.');
      } else {
          setTaxNumberError('');
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const [parent, child] = name.includes('.') ? name.split('.') : [name, ''];
    
      if (parent) {
        setFormState(prevState => ({
          ...prevState,
          [parent]: child ? {
            ...prevState[parent as keyof typeof prevState],
            [child]: value
          } : value
        }));
      } else {
        setFormState(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    };

      // Reset form to initial state
    const handleReset = () => {
        setFormState(initialFormState);
        setEmailError('');
    };

    // Copy shipping address to billing address
    const handleCopyAddress = () => {
      setFormState(prevState => ({
          ...prevState,
          billingAddress: { ...prevState.shippingAddress, taxNumber: prevState.billingAddress.taxNumber }
      }));
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError('');

      if (!checkRequiredFields()) {
        // If any required field is empty, stop form submission
        setFormError('Please fill all fields before submitting.');
        return;
      }

      try {
        const response = await registerUser(formState);
        console.log(response);
        // Display success message

        // Reset form state here
        //setFormState(initialFormState);
      } catch (error) {
        console.error('There was an error:', error);
        // handle registration failure.
      }
    };
  
    return (
      <div>
        <h1>Registration Form</h1>
        <form onSubmit={submitForm}>
          {/* Create fields for username, password, etc. */}
          <label>Username (Email): <input
          type="email"
          name="username"
          value={formState.username}
          onChange={handleInputChange}
          onBlur={e => validateEmail(e.target.value)} />
          </label>
          {emailError && <p style={{color: 'red'}}>{emailError}</p>}

          <label>Password: <input
          type='password'
          name='password'
          value={formState.password}
          onChange={handleInputChange}
          onBlur={(e) => {ValidatePassword(e.target.value);}} />
          </label>
          {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}

          <label>Confirm Password: <input
          type='password'
          name='passwordConfirm'
          value={formState.passwordConfirm}
          onChange={handleInputChange}
          onBlur={handlePasswordMismatch} />
          </label>
          {passwordConfirmError && <p style={{color: 'red'}}>{passwordConfirmError}</p>}

          <label>First Name: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange}/></label>
          
          <label>Last Name: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange}/></label>

          <label>Shipping Address - Name: <input type='text' name='shippingAddress.name' value={formState.shippingAddress.name} onChange={handleInputChange}/></label>
          <label>Country: <input type='text' name='shippingAddress.country' value={formState.shippingAddress.country} onChange={handleInputChange}/></label>
          <label>City: <input type='text' name='shippingAddress.city' value={formState.shippingAddress.city} onChange={handleInputChange}/></label>
          <label>Street: <input type='text' name='shippingAddress.street' value={formState.shippingAddress.street} onChange={handleInputChange}/></label>
          <label>Zip: <input type='text' name='shippingAddress.zip' value={formState.shippingAddress.zip} onChange={handleInputChange}/></label>

          <label>Phone Number: <input
          type='text'
          name='shippingAddress.phoneNumber'
          value={formState.shippingAddress.phoneNumber}
          onChange={handleInputChange}
          onBlur={(e) => validatePhoneNumber(e.target.value)}/>
          </label>
          {phoneNumberError && <p style={{color: 'red'}}>{phoneNumberError}</p>}

          <button type='button' onClick={handleCopyAddress}>Copy Shipping to Billing</button>
          {/* Create fields for billingAddress */}
          <label>Billing Address - Name: <input type='text' name='billingAddress.name' value={formState.billingAddress.name} onChange={handleInputChange}/></label>
          <label>Country: <input type='text' name='billingAddress.country' value={formState.billingAddress.country} onChange={handleInputChange}/></label>
          <label>City: <input type='text' name='billingAddress.city' value={formState.billingAddress.city} onChange={handleInputChange}/></label>
          <label>Street: <input type='text' name='billingAddress.street' value={formState.billingAddress.street} onChange={handleInputChange}/></label>
          <label>Zip: <input type='text' name='billingAddress.zip' value={formState.billingAddress.zip} onChange={handleInputChange}/></label>

          <label>Tax Number: <input
          type='text'
          name='billingAddress.taxNumber'
          value={formState.billingAddress.taxNumber}
          onChange={handleInputChange}
          onBlur={(e) => validateTaxNumber(e.target.value)}/>
          </label>
          {taxNumberError && <p style={{color: 'red'}}>{taxNumberError}</p>}

          {formError && <div style={{ color: 'red' }}>{formError}</div>}
          {userError && <div style={{ color: 'red' }}>{userError}</div>}

          <button type='button' onClick={handleReset}>Clear Form</button>
          <button type='submit' >Register</button>
        </form>
      </div>
    );
  }

export default RegistrationForm;
