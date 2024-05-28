import RegistrationForm from "../Registration/Registration";
import HomeScreen from '../HomeScreen/Home';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import LoginForm from "../Login/Login";
import Profile from '../Profile/Profile';
import { UserProvider } from '../Profile/UserContext';
import ChangePasswordForm from "../ChangePassword/ChangePassword";

/*function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/Registration" element={<RegistrationForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/ChangePassword" element={<ChangePasswordForm />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;*/

const App = () => {
  return (
    <UserProvider> {/* Add UserProvider here */}
      <Router>
        <div>
          <nav style={{ marginBottom: '20px' }}>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '20px' }}>
              <li><Link to="/">Home</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<HomeScreen/>} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/Registration" element={<RegistrationForm />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/ChangePassword" element={<ChangePasswordForm />} />
            {/* You can add a Route here for a default or home page */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
