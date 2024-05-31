import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { getUsers } from '../index';

function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!user);
  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      getUsers()
        .then(userData => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch user:', error);
          setIsLoading(false);
          navigate('/login');
        });
    }
  }, [navigate, setUser, user]);
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/login');
  };
  if (isLoading) {
    return <div>Loading user data...</div>;
  }
  if (!user) {
    return <div>No user is loged in...</div>;
  }
  const { userId, email, firstName, lastName, shippingAddress, billingAddress } = user;
  const { name: shippingName, country: shippingCountry, city: shippingCity, street: shippingStreet, zip: shippingZip, phoneNumber } = shippingAddress;
  const { name: billingName, country: billingCountry, city: billingCity, street: billingStreet, zip: billingZip, taxNumber } = billingAddress;
  return (
    <div>
      <h2>Your Profile</h2>
      <p>UserID: {userId}</p>
      <p>Username: {email}</p>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>

      <h3>Shipping Address</h3>
      <p>Name: {shippingName}</p>
      <p>Country: {shippingCountry}</p>
      <p>City: {shippingCity}</p>
      <p>Street: {shippingStreet}</p>
      <p>ZIP: {shippingZip}</p>
      <p>Phone Number: {phoneNumber}</p>

      <h3>Billing Address</h3>
      <p>Name: {billingName}</p>
      <p>Country: {billingCountry}</p>
      <p>City: {billingCity}</p>
      <p>Street: {billingStreet}</p>
      <p>ZIP: {billingZip}</p>
      <p>Tax Number: {taxNumber}</p>
      <li><Link to='../ChangeProfile'>Change Profile Data</Link></li>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;