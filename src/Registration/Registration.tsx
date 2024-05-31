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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
      
        if (response.status === 201) {
          const data = await response.json();
          console.debug(data);
          return data;
        } else {
          throw new Error('Létező felhasználó');
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
      if (formState.password !== formState.confirmPassword) {
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

    const handleConfirmPasswordMismatch = handlePasswordMismatch;

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

    const canSubmit = () => {
      const { username, password, passwordConfirm, firstName, lastName, shippingAddress } = formState;
      const requiredFieldsFilled = username && password && passwordConfirm && firstName && lastName && Object.values(shippingAddress).every(value => value);
      return requiredFieldsFilled && !emailError && !passwordError && !isSubmitting;
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const response = await registerUser(formState);
        console.log(response);
        // Display success message
        alert('Registration successful!');

        // Reset form state here
        setFormState(initialFormState);
      } catch (error) {
        console.error('There was an error:', error);
        alert('Registration failed. Please try again.');
        // handle registration failure.
      } finally {
        setIsSubmitting(false); // Re-enable the submit button
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
          required onBlur={e => validateEmail(e.target.value)} />
          </label>
          {emailError && <p style={{color: 'red'}}>{emailError}</p>}

          <label>Password: <input
          type='password'
          name='password'
          value={formState.password}
          onChange={handleInputChange}
          required onBlur={(e) => {ValidatePassword(e.target.value); handlePasswordMismatch();}} />
          </label>
          {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
          {passwordConfirmError && <p style={{color: 'red'}}>{passwordConfirmError}</p>}

          <label>Confirm Password: <input
          type='password'
          name='passwordConfirm'
          value={formState.passwordConfirm}
          onChange={handleInputChange}
          required onBlur={handleConfirmPasswordMismatch} />
          </label>
          {passwordConfirmError && <p style={{color: 'red'}}>{passwordConfirmError}</p>}

          <label>First Name: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange} required /></label>
          <label>Last Name: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange} required /></label>
          {/* Create fields for shippingAddress */}
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
          onBlur={(e) => validatePhoneNumber(e.target.value)} required />
          </label>
          {phoneNumberError && <p style={{color: 'red'}}>{phoneNumberError}</p>}

          <button type='button' onClick={handleCopyAddress}>Copy Shipping to Billing</button>
          {/* Create fields for billingAddress */}
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
          onBlur={(e) => validateTaxNumber(e.target.value)} required />
          </label>
          {taxNumberError && <p style={{color: 'red'}}>{taxNumberError}</p>}

          <button type='button' onClick={handleReset}>Clear Form</button>
          <button type='submit' disabled={!canSubmit()}>Register</button>
        </form>
      </div>
    );
  }

export default RegistrationForm;
