import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

  export async function registerUser(registerdata = {}) {
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

  export function getUsers() {
    // Retrieve the token from localStorage within the function
    const authtoken = localStorage.getItem('accessToken');
    
    if (!authtoken) {
      throw new Error('Access token is missing');
    }
  
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authtoken
    });
  
    return fetch('http://localhost:5000/user', {
      method: 'GET',
      headers: myHeaders,
    })
    .then(response => {
      if (response.status === 200) {
        return response.json(); // if the response is successful, parse the JSON body
      } else {
        throw new Error('Something went wrong on the api server!');
      }
    })
    .then(data => {
      console.debug(data);
      return data;
    })
    .catch(error => {
      console.error(error);
      throw error; // Re-throw the error for further handling
    });
  }


export function loginUser(logindata = {}) {
  const myHeaders = new Headers({
      'Content-Type': 'application/json',
  });
  
  return fetch('http://localhost:5000/user/login', {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(logindata)
  })
  
  .then(response => {
    console.log(logindata)
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error('Hibás felhasználónév vagy jelszó');
      }
    })
    .then(response => {
      console.debug(response);
      return response;
    }).catch(error => {
      console.error(error);
    });
  }