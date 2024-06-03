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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      username: username.trim(),
      password: password.trim(),
    };

    try {
      const response = await loginUser(payload);

      // Save the access token in localStorage if it exists in the response
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        // Fetch the user data
        const userData = await getUsers();

        if (userData) {
          setUser(userData);
          navigate('/');
        } else {
        }
      } else {
      }
    } catch (error) {
      if (error instanceof Error) {
      } else {
      }
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username (Email):
          <input type="email" name="username" value={username} onChange={e => setUsername(e.target.value)} onBlur={e => validateEmail(e.target.value)} required />
        </label>
        {emailError && <p style={{color: 'red'}}>{emailError}</p>}
        <label>
          Password:
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={(e) => {ValidatePassword(e.target.value)}} required />
        </label>
        {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default LoginForm;