import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from '../Profile/UserContext';
import LoginForm from "../Login/Login";
import RegistrationForm from "../Registration/Registration";
import Profile from '../Profile/Profile';

const App = () => {
  return (
    <UserProvider> {/* Add UserProvider here */}
      <Router>
        <div>
          <nav style={{ marginBottom: '20px' }}>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/profile" element={<Profile />} />
            {/* You can add a Route here for a default or home page */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;