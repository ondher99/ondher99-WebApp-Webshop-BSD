import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Profile/UserContext';

const HomeScreen: React.FC = () => {
  const { user } = useUser();
  if(user){
    return (
      <div>
        <h1 >Welcome to our webshop!</h1>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
          <Link to="/Profile">Profile</Link> | <Link to="/products">Product list</Link>
        </ul>
      </div>
    );
  }else{
    return (
    <div>
      <h1>Welcome to our webshop!</h1>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
        <Link to="/Login">Login</Link> | <Link to="/Registration">Register</Link> | <Link to="/products">Product list</Link>
      </ul>
    </div>
  );
  }
};
export default HomeScreen;
