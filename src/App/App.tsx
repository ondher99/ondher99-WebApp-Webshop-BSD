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
import ChangePasswordForm from "../ChangePassword/ChangePassword";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav>
          <Link to="/">Home</Link>
          {/* Add other links */}
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/Registration" element={<RegistrationForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/ChangePassword" element={<ChangePasswordForm />} />
          {/* Define other routes */}
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
