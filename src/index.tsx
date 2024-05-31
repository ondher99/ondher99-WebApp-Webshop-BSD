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

reportWebVitals();

function registerUser(url = "", registerdata = {}) {
  const myHeaders = new Headers({
      'Content-Type': 'application/json',
  });
  
  return fetch(url, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(registerdata)
  })
  
  .then(response => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error('Létező felhasználó');
      }
    })
    .then(response => {
      console.debug(response);
      return response;
    }).catch(error => {
      console.error(error);
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

    export function changeData(url = "", registerdata = {}) {
      const authtoken = localStorage.getItem('accessToken')
      const myHeaders = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authtoken
      });
      
      return fetch(url, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(registerdata)
      })
      
      .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Hiányzó vagy érvénytelen auth token - belépés szükséges');
          }
        })
        .then(response => {
          console.debug(response);
          return response;
        }).catch(error => {
          console.error(error);
        });
      }

export function getUsers() {
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
      return response.json();
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
    throw error;
  });
}
  
export default registerUser;