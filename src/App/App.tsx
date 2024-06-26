import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../HomeScreen/Home';
import { UserProvider } from '../Profile/UserContext';
import LoginForm from "../Login/Login";
import Profile from '../Profile/Profile';
import ChangePasswordForm from "../ChangePassword/ChangePassword";
import ChangeProfileDataForm from "../ChangeProfile/ChangeProfileData";
import RegistrationForm from "../Registration/Registration";
import CategoryPage from "../views/Product/CategoryPage";
import { Navbar } from '../Navbar/Navbar'
import ProductPage from '../views/Product/ProductPage';

const App = () => {

  return (
    <UserProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeScreen/>} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/Registration" element={<RegistrationForm />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/ChangePassword" element={<ChangePasswordForm />} />
            <Route path="/ChangeProfile" element={<ChangeProfileDataForm />} />
            <Route path="/products" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;