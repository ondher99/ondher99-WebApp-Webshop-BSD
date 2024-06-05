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
  logout: () => void;
};

export function getUsers() {
 
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
      return response.json();
    } else {
      console.error('Something went wrong on the API server!');
      return null;
    }
  })
  .then(data => {
    console.debug(data);
    return data;
  })
  .catch(error => {
    console.error(error);
    throw error; 
  });
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };
  
  useEffect(() => {
    const authtoken = localStorage.getItem('accessToken'); 
    
    if (!authtoken) {
      console.error("No access token found");
      return; 
    }

    getUsers()
    .then(response => {
      setUser(response);
    })
    .catch(error => {
      console.error("Failed to fetch user:", error);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
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