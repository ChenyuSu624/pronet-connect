import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaUserCircle } from 'react-icons/fa';
import { SlEnvolope } from "react-icons/sl"; // Replace SlEnvelope with SlEnvelopeOpen
import { FaRegTrashCan } from 'react-icons/fa6'; // Import the FaRegTrashCan icon
import { MdOutlinePersonPinCircle } from 'react-icons/md'; // Import the location icon
import { getUserById, getConnectionsByIds, removeConnection } from '../../services/userService'; // Import removeConnection
import MessageWindow from '../MessageWindow/MessageWindow'; // Import the MessageWindow component
import './Connections.css';

const Connections = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]); // State to store connection details
  const [sortCriteria, setSortCriteria] = useState('name'); // State for sorting criteria
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 6; // Maximum cards per page
  const [activeChat, setActiveChat] = useState(null); // State to track the active chat

  useEffect(() => {
    if (userId) {
      // Fetch user data
      getUserById(userId)
        .then((data) => {
          setUser(data);
          if (Array.isArray(data.connections) && data.connections.length > 0) {
            // Fetch connection details using connection IDs
            getConnectionsByIds(data.connections)
              .then((connectionData) => {
                setConnections(connectionData);
              })
              .catch((error) => console.error('Failed to fetch connections:', error));
          } else {
            setConnections([]); // No connections
          }
        })
        .catch((error) => console.error('Failed to fetch user data:', error));
    }
  }, [userId]);

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRemoveConnection = (connectionId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this connection?");
    if (confirmDelete) {
      removeConnection(userId, connectionId)
        .then(() => {
          // Update the local state after successful removal
          setConnections((prevConnections) =>
            prevConnections.filter((connection) => connection.id !== connectionId)
          );
        })
        .catch((error) => console.error('Failed to remove connection:', error));
    }
  };

  const handleOpenChat = (connection) => {
    setActiveChat(connection); // Set the active chat to the selected connection
  };

  const handleCloseChat = () => {
    setActiveChat(null); // Close the chat window
  };

  const sortedConnections = [...connections].sort((a, b) => {
    if (sortCriteria === 'name') {
      return a.firstName.localeCompare(b.firstName);
    } else if (sortCriteria === 'jobTitle') {
      return a.jobTitle.localeCompare(b.jobTitle);
    } else if (sortCriteria === 'location') {
      return a.location.localeCompare(b.location);
    }
    return 0;
  });

  const filteredConnections = sortedConnections.filter((connection) =>
    `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedConnections = filteredConnections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  const connectionCount = filteredConnections.length;
  const pendingRequests = Array.isArray(user.pendingFriendRequests) ? user.pendingFriendRequests.length : 0;
  const profileViews = user.profileViews || 0;

  return (
    <div className="connections-container">
      <Navbar
        showSearch={true}
        showProfileIcon={true}
        onSearchChange={handleSearchChange} // Pass the search handler to Navbar
      />
      <div className="connections-panel">
        <div className="stat">
          <h2>{connectionCount}</h2>
          <p>Connections</p>
        </div>
        <div className="stat">
          <h2>{pendingRequests}</h2>
          <p>Pending Invites</p>
        </div>
        <div className="stat">
          <h2>{profileViews}</h2>
          <p>Profile Views</p>
        </div>
      </div>
      <div className="connections-content">
        <h1>Connections</h1>
        <div className="sort-dropdown">
          <label htmlFor="sort-connections">Sort by:</label>
          <select
            id="sort-connections"
            className="sort-select"
            value={sortCriteria}
            onChange={handleSortChange}
          >
            <option value="name">Name</option>
            <option value="jobTitle">Job Title</option>
            <option value="location">Location</option>
          </select>
        </div>
        <div className="connections-list">
          {paginatedConnections.map((connection) => (
            <div key={connection.id} className="connection-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUserCircle className="connection-avatar" />
                <h3>{connection.firstName} {connection.lastName}</h3> {/* Display full name */}
              </div>
              <div className="connection-info">
                <div className="connection-details">
                  <p>{connection.jobTitle} at {connection.company}</p> {/* Display job title and company */}
                  <p className="connection-location">
                    <MdOutlinePersonPinCircle style={{ marginRight: '5px' }} />
                    {connection.location}
                  </p> {/* Display location */}
                </div>
              </div>
              <div className="connection-actions" style={{ marginTop: 'auto' }}>
                <button
                  className="message-button"
                  onClick={() => handleOpenChat(connection)} // Open chat window
                >
                  <SlEnvolope style={{ marginRight: '5px' }} /> Message
                </button>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveConnection(connection.id)}
                >
                  <FaRegTrashCan style={{ marginRight: '5px' }} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {activeChat && (
          <MessageWindow
            connection={activeChat}
            onClose={handleCloseChat} // Pass the close handler
          />
        )}
        <div className="pagination-controls-connections">
          <button
            className="pagination-button-connections"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {totalPages <= 5 ? (
            Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-button-connections ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))
          ) : (
            <>
              {currentPage > 3 && (
                <>
                  <button
                    className="pagination-button-connections"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  <span className="pagination-ellipsis">...</span>
                </>
              )}
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, index) => currentPage - 2 + index
              )
                .filter((page) => page >= 1 && page <= totalPages)
                .map((page) => (
                  <button
                    key={page}
                    className={`pagination-button-connections ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              {currentPage < totalPages - 2 && (
                <>
                  <span className="pagination-ellipsis">...</span>
                  <button
                    className="pagination-button-connections"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </>
          )}
          <button
            className="pagination-button-connections"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connections;
