import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


interface Category {
  id: string;
  name: string;
  image: string;
}



function keyExists(key: string): boolean {
  return localStorage.getItem(key) !== null;
}


function HomeScreen() {

  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories (categoryData: Category[]){
    const myHeaders = new Headers({
        'Content-Type': 'application/json',
    });
  
    const response = await fetch("http://localhost:5000/products/categories", {
      method: 'GET',
      headers: myHeaders,
      body: JSON.stringify(categoryData)
    })
  try{
    if(response.ok){
      setCategories(categoryData)
      console.debug(categories)
    }else{
      console.debug(response);
    }
  }catch(error){
    console.debug(error)
  }

  }
    if(keyExists("accessToken")){
    return (
      <div>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
          <Link to="/Profile">Profile</Link> | <Link to="/ChangePassword">Change password</Link> | <Link to="/products">Product list</Link>
        </ul>
      </div>
    );
  }else{
    return (
    <div>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }} >
        <Link to="/Login">Login</Link> | <Link to="/Registration">Register</Link>
      </ul>
    </div>
  );
  }
};
export default HomeScreen;
