/*import React, { useState } from 'react';
import { loginUser} from '../index';

const LoginForm = () => {
  const [formState, setFormState] = useState({ username: '', password: '' });

  const handleInputChange = (event: { target: any; }) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const submitForm = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    loginUser('http://localhost:5000/user/login', formState)
      .then(response => {
        // handle login success, receive and store token etc.
        console.log(response);
      })
      .catch(error => {
        // handle login error
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={submitForm}>
        <label>
          Username (Email):
          <input type='email' name='username' value={formState.username} onChange={handleInputChange} required />
        </label>
        <label>
          Password:
          <input type='password' name='password' value={formState.password} onChange={handleInputChange} required />
        </label>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;*/

import React, { useState } from 'react';
import { loginUser } from '../index';

const LoginForm = () => {
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
      const response = await loginUser('http://localhost:5000/user/login', payload);
      console.log(response);
      // handle login success, receive and store token etc.
    } catch (error) {
      // handle login error
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