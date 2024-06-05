import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Logout function to clear user context and accessToken
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  // Automatically redirect to login if there is no user logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Destructure shipping and billing addresses
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