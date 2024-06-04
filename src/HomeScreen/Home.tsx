import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Profile/UserContext';
import { getUsers } from '../index';
import "./Home.css"

interface Category {
  id: string;
  name: string;
  image: string;
  productcount: number;
}


const HomeScreen: React.FC = () => {
  const { user } = useUser();
  const [ categories, setCategories ] = useState<Category[]>([]);

  useEffect(() => { 
    const fetchCategories = async () => {
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
      });
    
      const response = await fetch('http://localhost:5000/products/categories', {
        method: 'GET',
        headers: myHeaders
      });
      if (response.ok) {
        const data: Category[] = await response.json()
        setCategories(data);
        console.debug(categories);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    }
    fetchCategories();
    console.debug(categories);
  }, []);

  return (
    <div>
      <h1>Welcome to our webshop!</h1>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
        {user ? (
          <>
            <Link to="/Profile">Profile</Link> 
            {categories.map((category) => (
              <div className="category-image" key={category.id}>
              <Link to="/products">{category.name}</Link>
              <img src={category.image} alt={category.name} />
              </div>
            ))}
          </>
        ) : (
          <>
            <Link to="/Login">Login</Link> 
            <Link to="/Registration">Register</Link>
            {categories.map((category) => (
              <div className="category-image" key={category.id}>
              <Link to="/products">{category.name}</Link>
              <img src={category.image} alt={category.name} />
              </div>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};
export default HomeScreen;
