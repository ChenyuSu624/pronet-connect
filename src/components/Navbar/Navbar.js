import React from 'react';
import { useLocation } from 'react-router-dom'; // Import hook to detect current route
import { FaUserCircle } from 'react-icons/fa'; // Import React icon for profile avatar
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup'; // Check if on the signup page
  const isDashboardPage = location.pathname === '/dashboard'; // Check if on the dashboard page

  return (
    <header className="navbar-header">
      <nav className={`navbar ${isSignupPage ? 'navbar-signup' : ''}`}>
        <div className="logo-title-container">
          <img src="/logo.gif" className="logo"/>
          <h1 className="navbar-title">ProNet Connect</h1>
        </div>
        {isDashboardPage && (
          <div className="navbar-dashboard">
            <div className="navbar-dashboard-inline">
              <input
                type="text"
                placeholder="Search jobs, people, or content..."
                className="searchbox"
              />
              <FaUserCircle className="navbar-profile-icon" />
            </div>
          </div>
        )}
        {!isSignupPage && !isDashboardPage && (
          <>
            <input
              type="text"
              placeholder="Search jobs, people, or content..."
              className="navbar-search"
            />
            <FaUserCircle className="navbar-profile-icon" />
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
