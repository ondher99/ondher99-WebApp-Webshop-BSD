import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import { UserProvider } from './Profile/UserContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();