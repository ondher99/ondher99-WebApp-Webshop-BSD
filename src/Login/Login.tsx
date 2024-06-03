import React, { useEffect, useState } from 'react';
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
  const [isEmailValid, setIsEmailValid] = useState(false);  // State to track if email is valid
  const [isPasswordValid, setIsPasswordValid] = useState(false); // State to track if password is valid
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  // On component mount, check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Assuming getUsers will set the user profile based on the token
      getUsers().then((userData) => {
        setUser(userData);
        navigate('/profile'); // Redirect to profile page
      }).catch(error => {
        console.log('Error fetching user data: ', error);
      });
    }
  }, [navigate, setUser]);

  function handleValidation () {
    // Check and show field required messages upon submit attempt
    const emailValid = validateEmail(username);
    const passwordValid = ValidatePassword(password);
    return emailValid && passwordValid;
  }

  function validateEmail(inputEmail: string) {
    const regex = /^\S+@\S+\.\S+$/;
    if(!regex.test(inputEmail)){
        setEmailError('Invalid email format');
        setIsEmailValid(false);  // Email is not valid
        return false;
    }
    setEmailError('');
    setIsEmailValid(true);  // Email is valid
    return true;
  }

  function ValidatePassword(inputPassword: string) {
    const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if(!regex.test(inputPassword)){
      setPasswordError('Invalid password format');
      setIsPasswordValid(false);  // Password is not valid
      return false;
    }
    setPasswordError('');
    setIsPasswordValid(true);  // Password is valid
    return true;
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

  // onSubmit handler remains the same
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitAttempted(true); // User attempted to submit the form

    if (!handleValidation()) {
      // Stop the submit if validation fails
      return;
    }

    setLoginError('');

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
          onBlur={e => validateEmail(e.target.value)} required />
        </label>
        {(isSubmitAttempted && !username) && <p style={{color: 'red'}}>Field required</p>}
        {emailError && <p style={{color: 'red'}}>{emailError}</p>}

        <label>
          Password:
          <input type="password" name="password" value={password} 
          onChange={e => setPassword(e.target.value)} 
          onBlur={e => {ValidatePassword(e.target.value)}} required />
        </label>
        {(isSubmitAttempted && !password) && <p style={{color: 'red'}}>Field required</p>}
        {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}

        {loginError && <p className="login-error">{loginError}</p>}

        <button type="submit" disabled={!(isEmailValid && isPasswordValid)}>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;