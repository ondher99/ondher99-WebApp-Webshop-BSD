import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useUser } from '../Profile/UserContext';

export const Navbar = () => {
    const { user, logout } = useUser();
  
    return (
        <nav style={{ marginBottom: '20px' }}>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '20px' }}>
          <li><Link to="/">Home</Link></li>
          {user ? (
            <li><Link to="/Profile">Profile</Link></li>
          ) : (
            <>
              <li><Link to="/Login">Login</Link></li>
              <li><Link to="/Registration">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    );
  };