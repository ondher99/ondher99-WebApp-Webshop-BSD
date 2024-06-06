import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, getUsers } from '../Profile/UserContext';

const LoginForm = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState('');

  const checkRequiredFields = () => {

    const requiredFields = [
      username,
      password,
    ];
    
    const result = requiredFields.every(field => field.trim() !== '');

    return result;
  };

  function validateEmail(inputEmail: string) {
    const regex = /^\S+@\S+\.\S+$/;
    const isValid = regex.test(inputEmail);
    setEmailError(isValid ? '' : 'Invalid email format');
    return isValid;
  }

  function validatePassword(inputPassword: string) {
    const regex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
    const isValid = regex.test(inputPassword);
    setPasswordError(isValid ? '' : 'Password must be at least 8 characters long with at least 1 number and 1 lower case letter');
    return isValid;
  }

  interface LoginData {
    username: string;
    password: string;
  }

  async function loginUser(logindata: LoginData) {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
    });
  
    const response = await fetch('http://localhost:5000/user/login', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(logindata)
    });
  
    if (response.ok) {
      return await response.json();
    } else {
  
      let errorMessage = 'Login failed due to an unexpected error.'; // Default message
      if (response.status === 400) {
        errorMessage = 'Bad request: The request was invalid.';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized: Incorrect username or password.';
      }
      
      throw new Error(errorMessage);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitAttempted(true);

    if (!checkRequiredFields()) {
      setFormError('Please fill all fields before submitting.');
      return;
    }

    const isEmailValid = validateEmail(username);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setLoginError('Enter correct email and password!');
      return;
    }

    const payload = {
      username: username.trim(),
      password: password.trim(),
    };

    try {
      const response = await loginUser(payload);

      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        const userData = await getUsers();
        console.log(userData);

        if (userData) {
          setUser(userData);
          navigate('/');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message || 'An error occurred during login.');
      } else {
        setLoginError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username (Email):
          <input type="email" name="username" value={username} 
          onChange={e => setUsername(e.target.value)} 
          onBlur={e => validateEmail(e.target.value)}/>
        </label>
        {(isSubmitAttempted && !username) && <p style={{color: 'red'}}>Field required</p>}
        {emailError && <p style={{color: 'red'}}>{emailError}</p>}

        <label>
          Password:
          <input type="password" name="password" value={password} 
          onChange={e => setPassword(e.target.value)} 
          onBlur={e => {validatePassword(e.target.value)}}/>
        </label>
        {(isSubmitAttempted && !password) && <p style={{color: 'red'}}>Field required</p>}
        {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
        
        {formError && <div style={{ color: 'red' }}>{formError}</div>}
        {loginError && <p style={{ color: 'red' }} className="login-error">{loginError}</p>}

        <button type="submit" >Login</button>
      </form>
    </div>
  );
};

export default LoginForm;