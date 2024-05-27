import React from 'react';
import { Link } from 'react-router-dom';


const HomeScreen: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Our Webshop</h1>
      <Link to="/login">Login</Link> | <Link to="/Registration">Register</Link> | <Link to="/ChangePassword">Change password</Link>
      {/* Links or buttons for profile, cart, categories */}
    </div>
  );
};

export default HomeScreen;
