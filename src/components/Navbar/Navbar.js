import React from 'react';
import { useLocation } from 'react-router-dom'; // Import hook to detect current route
import { FaUserCircle } from 'react-icons/fa'; // Import React icon for profile avatar
import './Navbar.css';

const Navbar = ({ onSearchChange, isSignupPage }) => {
  const location = useLocation();
  const isJobBoardPage = location.pathname === '/job-board'; // Check if on the JobBoard page
  const isDashboardPage = location.pathname === '/dashboard'; // Check if on the dashboard page
  const isConnectionsPage = location.pathname === '/connections'; // Check if on the connections page
  const isPeopleUMayKnowPage = location.pathname === '/people-you-may-know'; // Check if on the PeopleUMayKnow page
  const isEventBoardPage = location.pathname === '/event-board'; // Check if on the EventBoard page
  const isDashboardOrConnectionsPage = isDashboardPage || isConnectionsPage || isPeopleUMayKnowPage; // Combine conditions

  return (
    <header className="navbar-header">
      <nav className={`navbar ${isSignupPage ? 'navbar-signup' : ''}`}>
        <div className="logo-title-container">
          <img src="/logo.gif" className="logo"/>
          <h1 className="navbar-title">ProNet Connect</h1>
        </div>
        {isDashboardOrConnectionsPage && !isSignupPage && (
          <div className="navbar-dashboard">
            <div className="navbar-dashboard-inline">
              <input
                type="text"
                placeholder={isConnectionsPage || isPeopleUMayKnowPage ? "Search people" : "Search jobs, people, or content..."} // Adjust placeholder
                className="searchbox"
                onChange={isConnectionsPage || isPeopleUMayKnowPage ? onSearchChange : undefined} // Call onSearchChange only on relevant pages
              />
              <FaUserCircle className="navbar-profile-icon" />
            </div>
          </div>
        )}
        {isJobBoardPage && !isSignupPage && (
          <div className="navbar-dashboard">
            <div className="navbar-dashboard-inline">
              <input
                type="text"
                placeholder="Search jobs" // Update placeholder for JobBoard
                className="searchbox"
                onChange={onSearchChange} // Use onSearchChange for JobBoard
              />
              <FaUserCircle className="navbar-profile-icon" />
            </div>
          </div>
        )}
        {isEventBoardPage && !isSignupPage && (
          <div className="navbar-dashboard">
            <div className="navbar-dashboard-inline">
              <input
                type="text"
                placeholder="Search event" // Update placeholder for EventBoard
                className="searchbox"
                onChange={onSearchChange} // Use onSearchChange for EventBoard
              />
              <FaUserCircle className="navbar-profile-icon" />
            </div>
          </div>
        )}
        {!isSignupPage && !isDashboardOrConnectionsPage && !isJobBoardPage && !isEventBoardPage && (
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
