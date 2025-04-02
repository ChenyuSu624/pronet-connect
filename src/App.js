import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPanel from './components/LoginPanel/LoginPanel';
import ForgotPassword from './components/Forgotpassword/ForgotPassword';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard'; // Import Dashboard component
import Connections from './components/Connections/Connections'; // Import Connections component
import PeopleUMayKnow from './components/Connections/PeopleUMayKnow'; // Import PeopleUMayKnow component
import JobBoard from './components/JobBoard/JobBoard'; // Import JobBoard component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPanel />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
          <Route path="/connections" element={<Connections />} /> {/* Add Connections route */}
          <Route path="/people-you-may-know" element={<PeopleUMayKnow />} /> {/* Add PeopleUMayKnow route */}
          <Route path="/job-board" element={<JobBoard />} /> {/* Add Job Board route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
