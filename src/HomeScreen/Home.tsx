import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

function keyExists(key: string): boolean {
  return localStorage.getItem(key) !== null;
}



const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  if(keyExists("accessToken")){
    return (
      <div>
        <h1 >Welcome to Our Webshop</h1>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
          <Link to="/Profile">Profile</Link> | <Link to="/ChangePassword">Change password</Link>
        </ul>
      </div>
    );
  }else{
    return (
    <div>
      <h1>Welcome to Our Webshop</h1>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
        <Link to="/Login">Login</Link> | <Link to="/Registration">Register</Link>
      </ul>
    </div>
  );
  }
  
};

export default HomeScreen;
