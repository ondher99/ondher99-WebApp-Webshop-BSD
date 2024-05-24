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
/*
export function registerUser(url = "", registerdata = {}) {
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
  }*/

  export async function registerUser(url = "", registerdata = {}) {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(registerdata)
      });
    
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

export function loginUser(url = "", logindata = {}) {
  const myHeaders = new Headers({
      'Content-Type': 'application/json',
  });
  
  return fetch(url, {
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

export function getUsers(url = "", authtoken = "") {
  const myHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authtoken
  });
  
  return fetch(url, {
    method: 'GET',
    headers: myHeaders,
  })
  
  .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Something went wrong on api server!');
      }
    })
    .then(response => {
      console.debug(response);
    }).catch(error => {
      console.error(error);
    });
  }
  
/*
const registrationdata = {
    "username": "superuser3@usa.com",
    "password": "IamNumbuh1",
    "passwordConfirm": "IamNumbuh1",
    "firstName": "George2",
    "lastName": "Washington2",
    "shippingAddress": {
      "name": "President of U.S.A.",
      "country": "United States of America",
      "city": "Washington D.C.",
      "street": "1600 Pennsylvania Avenue NW",
      "zip": "20500 U.S.",
      "phoneNumber": "+36201234567"
    },
    "billingAddress": {
      "name": "President of U.S.A.",
      "country": "United States of America",
      "city": "Washington D.C.",
      "street": "1600 Pennsylvania Avenue NW",
      "zip": "20500 U.S.",
      "taxNumber": "12345678911"
    }
}

const logindata = {
  "username": "superuser3@usa.com",
  "password": "IamNumbuh1"
}


registerUser("http://localhost:5000/user", registrationdata).then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
});

loginUser("http://localhost:5000/user/login", logindata).then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
  localStorage.setItem('accesstoken', data['accessToken']);
  var accessToken = localStorage.getItem('accesstoken');
  if (accessToken === null){
    accessToken = "";
  }
  var getDataResponse = getUsers("http://localhost:5000/user", accessToken);
  console.log(getDataResponse);

  //törölni accesstokent sessionböl:
  //localStorage.removeItem('accesstoken');
});
*/