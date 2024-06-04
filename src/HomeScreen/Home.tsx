import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Profile/UserContext';
import "./Home.css"

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

const HomeScreen: React.FC = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/products/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          setCategories(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (e) {
        setError('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  const renderCategoryLinks = () => categories.map((category) => (
    <div className="category-image" key={category.id}>
      <Link to={`/products/`}>{category.name}</Link>
      <img src={category.image} alt={category.name} />
      <span>{category.productCount} products</span>
    </div>
  ));

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome to our webshop!</h1>
      <ul className="category-list">
        {user ? (
          <>
            <Link to="/Profile">Profile</Link>
            {renderCategoryLinks()}
          </>
        ) : (
          <>
            <Link to="/Login">Login</Link> 
            <Link to="/Registration">Register</Link>
            {renderCategoryLinks()}
          </>
        )}
      </ul>
    </div>
  );
};

export default HomeScreen;