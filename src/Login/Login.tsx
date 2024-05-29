import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUsers } from '../index';
import { useUser } from '../Profile/UserContext';

const LoginForm = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const payload = {
      username: username.trim(),
      password: password.trim(),
    };
    console.log(username)
    console.log(password)

    try {
      const response = await loginUser(payload);
      
      // Assuming the token is in the response and called 'accessToken'
      if (response.accessToken) {
        // Save the access token in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        
        try {
          const userData = await getUsers();
          
          if (userData) {
            setUser(userData); // Save userData in UserContext
          
            // Navigate to the /profile page after successfully fetching and setting user data
            navigate('/profile');
          } else {
            // Handle the case when userData is null or undefined
            throw new Error('No userData received');
          }
        } catch (userDataError) {
          console.error('Could not fetch user data:', userDataError);
          navigate('/registration');
          // Handle error by showing user feedback or redirecting
        }

      } else {
        // Handle the case where there is no token in the response
        console.error('Login succeeded but no access token was returned');
      }
    } catch (error) {
      // Handle any errors that occurred during login
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username (Email):
          <input type="email" name="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;