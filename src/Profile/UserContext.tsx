import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    shippingAddress: {
      name: string;
      country: string;
      city: string;
      street: string;
      zip: string;
      phoneNumber: string;
    };
    billingAddress: {
      name: string;
      country: string;
      city: string;
      street: string;
      zip: string;
      taxNumber: string;
    };
  }

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export function getUsers() {
  // Retrieve the token from localStorage within the function
  const authtoken = localStorage.getItem('accessToken');
  
  if (!authtoken) {
    throw new Error('Access token is missing');
  }

  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + authtoken
  });

  return fetch('http://localhost:5000/user', {
    method: 'GET',
    headers: myHeaders,
  })
  .then(response => {
    if (response.status === 200) {
      return response.json(); // if the response is successful, parse the JSON body
    } else {
      throw new Error('Something went wrong on the api server!');
    }
  })
  .then(data => {
    console.debug(data);
    return data;
  })
  .catch(error => {
    console.error(error);
    throw error; // Re-throw the error for further handling
  });
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const authtoken = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
    
    if (!authtoken) {
      console.error("No access token found");
      return; // Early return if there's no token
    }

    // Fetch user data using the Authorization header with the token
    getUsers()
      .then(response => {
        setUser(response); // Assuming response is of UserType
      })
      .catch(error => {
        console.error("Failed to fetch user:", error);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};