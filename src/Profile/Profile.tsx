import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { getUsers } from '../index';

function Profile() {
  const { user, setUser } = useUser(); // Use the context to access and set the user data
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!user); // If there's no user data, we're loading

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      getUsers() // Your user profile endpoint
        .then(userData => {
          setUser(userData); // Update user context with the fetched data
          setIsLoading(false); // Set loading to false once the data is fetched
        })
        .catch(error => {
          console.error('Failed to fetch user:', error);
          setIsLoading(false); // Set loading to false also in case of an error
          navigate('/login'); // If there's an error, redirect back to login
        });
    }
  }, [navigate, setUser, user]);

  const handleLogout = () => {
    setUser(null); // Clear the user from the context state
    localStorage.removeItem('accessToken'); // Remove the accessToken from local storage
    navigate('/login'); // Redirect user to the login page
  };

  // If we are loading, show a loading message
  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>No user is loged in...</div>;
  }

  // `user` is guaranteed to be set
  const { userId, email, firstName, lastName, shippingAddress, billingAddress } = user;

  // Destructure shipping and billing addresses...
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
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;