import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from '../HomeScreen/Home';
import { UserProvider } from '../Profile/UserContext';
import LoginForm from "../Login/Login";
import Profile from '../Profile/Profile';
import ChangePasswordForm from "../ChangePassword/ChangePassword";
import ChangeProfileDataForm from "../ChangeProfile/ChangeProfileData";
import RegistrationForm from "../Registration/Registration";
import CategoryPage from "../views/Product/CategoryPage";


function keyExists(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

const App: React.FC = () => {
  return(
    <UserProvider>
      <Router>
        <div>
          <h1>Alfa csapat Webshop</h1>
          <nav style={{ marginBottom: '20px' }}>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '20px' }}>
            <Link to="/">Home</Link> | <Link to="/Profile">Profile</Link>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<HomeScreen/>} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/Registration" element={<RegistrationForm />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/ChangePassword" element={<ChangePasswordForm />} />
            <Route path="/ChangeProfile" element={<ChangeProfileDataForm />} />
            <Route path="/products" element={<CategoryPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;