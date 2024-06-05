import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        taxNumber?: string;
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

    async function registerUser(registerdata: IFormState) {
      const myHeaders = new Headers({
          'Content-Type': 'application/json',
      });
  
      let payload = { ...registerdata, billingAddress: { ...registerdata.billingAddress } };
  
      // If the taxNumber field is empty, delete it from the payload
      if (!payload.billingAddress.taxNumber?.trim()) {
          delete payload.billingAddress.taxNumber;
      }
  
      try {
          const response = await fetch('http://localhost:5000/user', {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(payload)
          });
  
          if (response.ok) {
              const data = await response.json();
              return data;
          } else {
              const errorData = await response.json();
              const errorMessage = errorData.message || 'There was an error with the registration.';
              throw new Error(errorMessage);
          }
      } catch (error: unknown) {
        console.error(error);
        
        if (error instanceof Error) {
            setUserError(error.message);
        } else {
            setUserError("An unexpected error occurred during registration.");
        }
        throw error;
      }
    }

    function validateEmail(inputEmail: string) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
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
      const regex = /^\+\d{3,}$/;
      if (!regex.test(phoneNumber)) {
          setPhoneNumberError('Invalid phone number format. It should start with a "+" and atleast 3 digits.');
      } else {
          setPhoneNumberError('');
      }
    };

    const validateTaxNumber = (taxNumber: string) => {
      // This regex matches exactly 11 digits
      const regex = /^\d{11}$/;
    
      // Only validate the taxNumber if there is an input
      if (taxNumber && !regex.test(taxNumber)) {
        setTaxNumberError('Tax number must contain exactly 11 digits.');
      } else {
        setTaxNumberError(''); // Clear the error if the format is correct or the field is empty
      }
    };

    const validateNameShipping = () => {
      if (formState.shippingAddress.name.length === 1) {
        setShippingNameError('Atleast 2 Characters!');
      }
      else {
        return;
      }
    };

    const validateNameBilling = () => {
      if (formState.billingAddress.name.length === 1) {
        setBillingNameError('Atleast 2 Characters!');
      }
      else {
        return;
      }
    };

    type FieldErrorSetterMap = {
      [key: string]: React.Dispatch<React.SetStateAction<string>>;
    };

    const fieldErrorSetters: FieldErrorSetterMap = {
      username: setEmailError,
      password: setPasswordError,
      passwordConfirm: setPasswordConfirmError,
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

      if (!fieldValue.trim()) {
        setError(`${fieldName.replace(/\./g, ' ')} is required!`);
      } else {
        setError(''); // Clear the error if the field is not empty
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
        setFormError('');
        setPasswordError('');
        setPasswordConfirmError('');
        setPhoneNumberError('');
        setTaxNumberError('');
        setUserError('');
        setFirstNameError('');
        setLastNameError('');
        setShippingNameError('');
        setShippingCountryError('');
        setShippingCityError('');
        setShippingStreetError('');
        setShippingZipError('');
        setBillingNameError('');
        setBillingCountryError('');
        setBillingCityError('');
        setBillingStreetError('');
        setBillingZipError('');
    };

    // Copy shipping address to billing address
    const handleCopyAddress = () => {
      setFormState(prevState => {
        // Destructure to exclude phoneNumber from the rest of the shippingAddress.
        const { phoneNumber, ...restOfShippingAddress } = prevState.shippingAddress;
        return {
          ...prevState,
          billingAddress: {
            // Spread the rest of the shipping address without phoneNumber.
            ...restOfShippingAddress,
            // Preserve the original taxNumber from the billingAddress.
            taxNumber: prevState.billingAddress.taxNumber
          }
        };
      });
    };

    const showSuccessNotification = () => {
      toast.success("Registration successful! You can now log in with your new account.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    const showErrorNotification = (message: string) => {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
      });
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setEmailError('');
      setFormError('');
      setPasswordError('');
      setPasswordConfirmError('');
      setPhoneNumberError('');
      setTaxNumberError('');
      setUserError('');
      setFirstNameError('');
        setLastNameError('');
        setShippingNameError('');
        setShippingCountryError('');
        setShippingCityError('');
        setShippingStreetError('');
        setShippingZipError('');
        setBillingNameError('');
        setBillingCountryError('');
        setBillingCityError('');
        setBillingStreetError('');
        setBillingZipError('');
    
      // Run all field validations again before submitting
      const isEmailValid = validateEmail(formState.username);
      const isPasswordValid = ValidatePassword(formState.password);
      handlePasswordMismatch(); // This will update the passwordConfirmError if there's a mismatch
      validatePhoneNumber(formState.shippingAddress.phoneNumber);
      // Only validate tax number if it's provided
      if (formState.billingAddress.taxNumber) {
        validateTaxNumber(formState.billingAddress.taxNumber);
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

      validateNameShipping();
      validateNameBilling();

  
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
        isEmailValid &&
        isPasswordValid &&
        passwordConfirmError === "" && // No mismatch error
        phoneNumberError === "" && // Phone number validation has passed
        taxNumberError === ""; // Tax number validation has passed or the field is empty
    
      if (!canSubmit) {
        setFormError('Please correct the errors before submitting.');
        return;
      }
    
      // If all validations pass, proceed with submitting the form
      try {
        await registerUser(formState);
        
        showSuccessNotification(); 
        handleReset(); // Clear the form after successful registration
      } catch (error) {
        showErrorNotification("Failed to register. Please try again later.");
      }
    };
  
    return (
      <div>
        <h1>Registration Form</h1>
        <form onSubmit={submitForm}>
          <label>(*) must fill</label>
          <label>Username (Email)*: <input
          type="email"
          name="username"
          value={formState.username}
          onChange={handleInputChange}
          onBlur={e => validateEmail(e.target.value)} />
          </label>
          {emailError && <p style={{color: 'red'}}>{emailError}</p>}

          <label>Password*: <input
          type='password'
          name='password'
          value={formState.password}
          onChange={handleInputChange}
          onBlur={(e) => {ValidatePassword(e.target.value);}} />
          </label>
          {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}

          <label>Confirm Password*: <input
          type='password'
          name='passwordConfirm'
          value={formState.passwordConfirm}
          onChange={handleInputChange}
          onBlur={handlePasswordMismatch} />
          </label>
          {passwordConfirmError && <p style={{color: 'red'}}>{passwordConfirmError}</p>}

          <label>First Name*: <input type='text' name='firstName' value={formState.firstName} onChange={handleInputChange}/></label>
          {firstNameError && <p style={{color: 'red'}}>{firstNameError}</p>}
          
          <label>Last Name*: <input type='text' name='lastName' value={formState.lastName} onChange={handleInputChange}/></label>
          {lastNameError && <p style={{color: 'red'}}>{lastNameError}</p>}

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

          <label>Phone Number*: <input
          type='text'
          name='shippingAddress.phoneNumber'
          value={formState.shippingAddress.phoneNumber}
          onChange={handleInputChange}
          onBlur={(e) => validatePhoneNumber(e.target.value)}/>
          </label>
          {phoneNumberError && <p style={{color: 'red'}}>{phoneNumberError}</p>}

          <button type='button' onClick={handleCopyAddress}>Copy Shipping to Billing</button>

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

          <label>(Optional) Tax Number: <input
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
          <ToastContainer/>
        </form>
      </div>
    );
  }

export default RegistrationForm;