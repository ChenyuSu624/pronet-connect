import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation for navigation
import Navbar from '../Navbar/Navbar';
import { FaUserCircle, FaPhotoVideo, FaVideo, FaCalendarAlt, FaThumbsUp, FaCommentAlt, FaShare } from 'react-icons/fa'; // Import required icons
import { IoMdPersonAdd } from 'react-icons/io'; // Import IoMdPersonAdd icon
import { IoTrashOutline } from "react-icons/io5"; // Import IoTrashOutline
import { getUserById, getNonConnections, sendFriendRequest, getFeeds, addPost, deletePost } from '../../services/userService'; // Use named import for getUserById, getNonConnections, sendFriendRequest, getFeeds, addPost, and deletePost
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [nonConnections, setNonConnections] = useState([]); // State to store non-connections
  const [allFeeds, setAllFeeds] = useState([]); // State to store all feeds
  const [currentPage, setCurrentPage] = useState(1); // Ensure the page number starts at 1
  const itemsPerPage = 4; // Number of feeds per page
  const [postContent, setPostContent] = useState(""); // State to store new post content
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation(); // Access navigation state
  const userId = location.state?.userId; // Retrieve user ID from state

  useEffect(() => {
    console.log('User ID:', userId); // Log the user ID for debugging
    if (!userId) {
      console.error('No user ID provided');
      navigate('/'); // Redirect to home if no user ID is found
      return;
    }

    // Fetch user data using getUserById
    getUserById(userId).then((data) => {
      setUser(data);
    }).catch((error) => {
      console.error('Failed to fetch user data:', error);
    });

    // Fetch non-connections using getNonConnections
    getNonConnections(userId).then((data) => {
      if (data.length > 0) {
        setNonConnections(data.slice(0, 2)); // Randomly select two users
      } else {
        console.warn("No non-connections found");
      }
    }).catch((error) => {
      console.error("Failed to fetch non-connections:", error);
    });

    // Fetch all feeds sorted by timestamp
    fetchFeeds();
  }, [userId, navigate]);

  const fetchFeeds = async () => {
    try {
      const feeds = await getFeeds(); // Fetch all feeds sorted by timestamp
      setAllFeeds(feeds);
    } catch (error) {
      console.error("Failed to fetch feeds:", error);
    }
  };

  const handleSignOut = () => {
    // Perform sign-out logic here (e.g., clearing user session)
    navigate('/'); // Redirect to home page
  };

  const handleSendFriendRequest = (targetUserId) => {
    if (!userId) return; // Ensure the current user ID is available
    sendFriendRequest(userId, targetUserId)
      .then(() => {
        console.log(`Friend request sent to user ID: ${targetUserId}`);
        // Remove the clicked user from the nonConnections list
        setNonConnections((prevNonConnections) =>
          prevNonConnections.filter((person) => person.id !== targetUserId)
        );

        // Fetch a new connection to replace the removed one
        getNonConnections(userId).then((data) => {
          const newConnection = data.find(
            (person) =>
              !nonConnections.some((existing) => existing.id === person.id)
          );
          if (newConnection) {
            setNonConnections((prevNonConnections) => [
              ...prevNonConnections,
              newConnection,
            ]);
          }
        });
      })
      .catch((error) => {
        console.error("Failed to send friend request:", error);
      });
  };

  const handleRefreshFeeds = () => {
    fetchFeeds(); // Refresh feeds by fetching all feeds sorted by timestamp
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) return; // Prevent empty posts
    const newPost = {
      userId,
      content: postContent,
      timestamp: new Date().toISOString(),
      likes: [],
      shares: [],
      comments: [],
    };
    try {
      const savedPost = await addPost(newPost); // Save the post to the database
      if (!savedPost.id) {
        console.error("Failed to save post: Missing post ID");
        return;
      }
      const userInfo = {
        firstName: user.firstName || "Unknown",
        lastName: user.lastName || "User",
        jobTitle: user.jobTitle || "Unknown Job",
      };
      setAllFeeds((prevFeeds) => [{ ...savedPost, user: userInfo }, ...prevFeeds]); // Add the new post to all feeds
      setPostContent(""); // Clear the input field
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId); // Delete the post from the database
      setAllFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== postId)); // Remove the post from all feeds
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(allFeeds.length / itemsPerPage)) {
      setCurrentPage(pageNumber); // Update the current page
    }
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(allFeeds.length / itemsPerPage);
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 2) pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (currentPage < totalPages - 2) pageNumbers.push('...');
      if (currentPage < totalPages - 1) pageNumbers.push(totalPages);
    }

    return pageNumbers.map((page, index) =>
      typeof page === 'number' ? (
        <button
          key={index}
          className={`page-number-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="ellipsis">
          {page}
        </span>
      )
    );
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading state until user data is fetched
  }

  const connectionCount = Array.isArray(user.connections) ? user.connections.length : user.connections || 0;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim(); // Concatenate first and last name

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFeeds = allFeeds.slice(startIndex, endIndex);

  return (
    <div className="dashboard-container">
      <Navbar isSignupPage={true} /> {/* Use the same Navbar style as on the Signup page */}
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <div className="profile-panel">
            <div className="profile-section">
              <FaUserCircle className="navbar-profile-icon" />
              <h2>{fullName || 'User'}</h2> {/* Display user's full name or fallback to 'User' */}
              <p>{user.jobTitle || 'Job Title'}</p> {/* Display user's job title or fallback */}
              <div className="profile-stats">
                <p>Profile views: <strong>{user.profileViews || 0}</strong></p> {/* Display profile views */}
                <p>Connections: <strong>{connectionCount}</strong></p> {/* Display connection count */}
              </div>
            </div>
          </div>
          <div className="menu-panel">
            <nav className="sidebar-menu">
              <ul>
                <li>Applications</li>
                <li onClick={() => navigate('/connections', { state: { userId } })}>Connections</li> {/* Pass userId to Connections */}
                <li>Events</li>
              </ul>
              <button className="signout-button" onClick={handleSignOut}>Sign Out</button> {/* Add sign-out button */}
            </nav>
          </div>
        </aside>
        <main className="dashboard-feed" style={{ width: '60%', minWidth: '400px', maxWidth: '800px' }}>
          <div className="post-input">
            <div className="post-input-header">
              <FaUserCircle className="post-input-avatar" />
              <input
                type="text"
                placeholder="Share your thoughts..."
                className="post-input-box"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)} // Update post content state
              />
            </div>
            <div className="post-input-actions">
              <div className="post-input-options">
                <button className="post-option-button"><FaPhotoVideo /></button>
                <button className="post-option-button"><FaVideo /></button>
                <button className="post-option-button"><FaCalendarAlt /></button>
              </div>
              <button className="post-submit-button" onClick={handlePostSubmit}>Post</button> {/* Add post submit button */}
            </div>
          </div>
          <div className="events-feed">
            {paginatedFeeds.map((feed) => (
              <div className="post" key={feed.id}>
                <div className="post-header">
                  <FaUserCircle className="post-avatar" />
                  <div className="post-user-info">
                    <h3>{`${feed.user?.firstName || "Unknown"} ${feed.user?.lastName || "User"}`}</h3>
                    <p>{feed.user?.jobTitle || "Unknown Job"}</p>
                    <p className="post-time">{new Date(feed.timestamp).toLocaleString()}</p>
                  </div>
                  {feed.userId === userId && ( // Show delete icon only for the user's own posts
                    <IoTrashOutline
                      className="delete-post-icon"
                      onClick={() => handleDeletePost(feed.id)}
                    />
                  )}
                </div>
                <p className="post-content">{feed.content}</p>
                {feed.image && <img src={feed.image} alt="Post" className="post-image" />}
                <div className="post-actions">
                  <button><FaThumbsUp /> {feed.likes?.length || 0} Likes</button>
                  <button><FaCommentAlt /> {feed.comments?.length || 0} Comments</button>
                  <button><FaShare /> Share</button>
                </div>
              </div>
            ))}
            <div className="pagination-controls">
              <button
                className="page-nav-button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button
                className="page-nav-button"
                disabled={currentPage === Math.ceil(allFeeds.length / itemsPerPage)}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
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
              <a
                href="#"
                className="view-all-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/people-you-may-know', { state: { userId } }); // Pass userId to PeopleUMayKnow
                }}
              >
                View all
              </a>
            </div>
            <ul className="people-list">
              {nonConnections.map((person) => (
                <li className="person-item" key={person.id}>
                  <div className="person-info">
                    <FaUserCircle className="person-avatar" />
                    <div className="person-details">
                      <p className="person-name">{`${person.firstName} ${person.lastName}`}</p>
                      <p className="person-job">{person.jobTitle} at {person.company}</p>
                    </div>
                  </div>
                  <IoMdPersonAdd
                    className="add-icon"
                    onClick={() => handleSendFriendRequest(person.id)} // Handle click event
                  />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;