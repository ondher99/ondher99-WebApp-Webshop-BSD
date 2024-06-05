import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const { email, firstName, lastName } = user;

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Username: {email}</p>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>

      <li><Link to='../ChangeProfile'>Change Profile Data</Link> | 
          <Link to='../ChangePassword'>Change password</Link></li>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;