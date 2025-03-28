import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPanel from './components/LoginPanel/LoginPanel';
import ForgotPassword from './components/Forgotpassword/ForgotPassword';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard'; // Import Dashboard component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPanel />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
