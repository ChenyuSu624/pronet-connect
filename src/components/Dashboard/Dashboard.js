import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../Navbar/Navbar';
import { FaUserCircle, FaPhotoVideo, FaVideo, FaCalendarAlt, FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa'; // Import required icons
import { IoMdPersonAdd } from 'react-icons/io'; // Import IoMdPersonAdd icon
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleSignOut = () => {
    // Perform sign-out logic here (e.g., clearing user session)
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="dashboard-container">
      <Navbar showSearch={true} showProfileIcon={true} /> {/* Pass props to customize Navbar */}
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <div className="profile-panel">
            <div className="profile-section">
              <FaUserCircle className="navbar-profile-icon" />
              <h2>John Anderson</h2>
              <p>Senior Product Designer</p>
              <div className="profile-stats">
                <p>Profile views: <strong>243</strong></p>
                <p>Connections: <strong>1,834</strong></p>
              </div>
            </div>
          </div>
          <div className="menu-panel">
            <nav className="sidebar-menu">
              <ul>
                <li>My Jobs</li>
                <li>Connections</li>
                <li>Groups</li>
                <li>Events</li>
              </ul>
              <button className="signout-button" onClick={handleSignOut}>Sign Out</button> {/* Add sign-out button */}
            </nav>
          </div>
        </aside>
        <main className="dashboard-feed">
          <div className="post-input">
            <div className="post-input-header">
              <FaUserCircle className="post-input-avatar" />
              <input type="text" placeholder="Share your thoughts..." className="post-input-box" />
            </div>
            <div className="post-input-actions">
              <div className="post-input-options">
                <button className="post-option-button"><FaPhotoVideo /></button>
                <button className="post-option-button"><FaVideo /></button>
                <button className="post-option-button"><FaCalendarAlt /></button>
              </div>
              <button className="post-submit-button">Post</button>
            </div>
          </div>
          <div className="post">
            <div className="post-header">
              <FaUserCircle className="post-avatar" />
              <div className="post-user-info">
                <h3>Sarah Chen</h3>
                <p>UX Research Lead at Google</p>
                <p className="post-time">4h ago</p>
              </div>
            </div>
            <p className="post-content">
              Excited to share that we're hiring for multiple UX Research positions! If you're passionate about user-centered design and have 3+ years of experience, check out the link below.
            </p>
            <img src="post-image.jpg" alt="Post" className="post-image" />
            <div className="post-actions">
              <button><FaThumbsUp /> 124 Likes</button>
              <button><FaCommentAlt /> 28 Comments</button>
              <button><FaShare /> Share</button>
            </div>
          </div>
          <div className="post">
            <div className="post-header">
              <FaUserCircle className="post-avatar" />
              <div class="post-user-info">
                <h3>Michael Roberts</h3>
                <p>Tech Lead at Microsoft</p>
                <p className="post-time">4h ago</p>
              </div>
            </div>
            <p className="post-content">
              Just published a new article on building scalable microservices architecture. Would love to hear your thoughts!
            </p>
            <div className="post-link">
              <a href="#" className="post-link-title">Building Scalable Microservices: A Comprehensive Guide</a>
              <p className="post-link-description">
                Learn about best practices, common pitfalls, and advanced techniques for building robust microservices architecture...
              </p>
            </div>
            <div className="post-actions">
              <button><FaThumbsUp /> 89 Likes</button>
              <button><FaCommentAlt /> 15 Comments</button>
              <button><FaShare /> Share</button>
            </div>
          </div>
        </main>
        <aside className="dashboard-rightbar">
          <section className="recommended-jobs rightbar-panel">
            <div className="recommended-jobs-header">
              <h3>Recommended Jobs</h3>
              <a href="#" className="view-all-link">View all</a>
            </div>
            <ul className="job-list">
              <li className="job-item">
                <p className="job-title">Senior UX Designer</p>
                <p className="job-company">Adobe • San Francisco, CA</p>
                <p className="job-date">Posted 2 days ago</p>
              </li>
              <li className="job-item">
                <p className="job-title">Product Manager</p>
                <p className="job-company">Spotify • Remote</p>
                <p className="job-date">Posted 3 days ago</p>
              </li>
            </ul>
          </section>
          <section className="upcoming-events rightbar-panel">
            <div className="upcoming-events-header">
              <h3>Upcoming Events</h3>
              <a href="#" className="view-all-link">View all</a>
            </div>
            <ul className="event-list">
              <li className="event-item">
                <p className="event-title">Tech Conference 2025</p>
                <p className="event-time">March 15-17, 2025</p>
                <p className="event-location">San Francisco, CA</p>
              </li>
              <li className="event-item">
                <p className="event-title">UX Design Workshop</p>
                <p className="event-time">March 25, 2025</p>
                <p className="event-location">Online Event</p>
              </li>
            </ul>
          </section>
          <section className="people-you-may-know rightbar-panel">
            <div className="people-you-may-know-header">
              <h3>People You May Know</h3>
              <a href="#" className="view-all-link">View all</a>
            </div>
            <ul className="people-list">
              <li className="person-item">
                <div className="person-info">
                  <FaUserCircle className="person-avatar" />
                  <div className="person-details">
                    <p className="person-name">Emma Wilson</p>
                    <p className="person-job">Product Designer at Apple</p>
                  </div>
                </div>
                <IoMdPersonAdd className="add-icon" />
              </li>
              <li className="person-item">
                <div className="person-info">
                  <FaUserCircle className="person-avatar" />
                  <div className="person-details">
                    <p className="person-name">David Kim</p>
                    <p className="person-job">Software Engineer at Netflix</p>
                  </div>
                </div>
                <IoMdPersonAdd className="add-icon" />
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
