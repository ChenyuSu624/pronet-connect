import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdOutlinePersonPinCircle } from 'react-icons/md'; // Import location icon
import { getNonConnections, sendFriendRequest } from '../../services/userService';
import './Connections.css';

const PeopleUMayKnow = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [nonConnections, setNonConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 12; // Maximum cards per page

  useEffect(() => {
    if (!userId) {
      console.error('No user ID provided');
      return;
    }

    // Fetch all non-connections
    getNonConnections(userId)
      .then((data) => setNonConnections(data))
      .catch((error) => console.error('Failed to fetch non-connections:', error));
  }, [userId]);

  const handleSendFriendRequest = (targetUserId) => {
    if (!userId) return;
    sendFriendRequest(userId, targetUserId)
      .then(() => {
        console.log(`Friend request sent to user ID: ${targetUserId}`);
        // Remove the clicked user from the nonConnections list
        setNonConnections((prevNonConnections) =>
          prevNonConnections.filter((person) => person.id !== targetUserId)
        );
      })
      .catch((error) => console.error('Failed to send friend request:', error));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredConnections = nonConnections.filter((person) =>
    `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchQuery)
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

  return (
    <div className="connections-container">
      <Navbar
        showSearch={true}
        showProfileIcon={true}
        onSearchChange={handleSearchChange} // Pass the search handler to Navbar
      />
      <div className="connections-content">
        <h1>People You May Know</h1>
        <div className="connections-list">
          {paginatedConnections.map((person) => (
            <div key={person.id} className="connection-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUserCircle className="connection-avatar" />
                <h3>{person.firstName} {person.lastName}</h3> {/* Display full name */}
              </div>
              <div className="connection-info">
                <div className="connection-details">
                  <p>{person.jobTitle} at {person.company}</p> {/* Display job title and company */}
                  <p className="connection-location">
                    <MdOutlinePersonPinCircle style={{ marginRight: '5px' }} />
                    {person.location || 'Location not available'}
                  </p> {/* Display location */}
                </div>
              </div>
              <div className="connection-actions" style={{ marginTop: 'auto' }}>
                <button
                  className="add-icon-people-umayknow" // Apply the new CSS class
                  onClick={() => handleSendFriendRequest(person.id)}
                >
                  Add Connection
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-controls-people-umayknow">
          <button
            className="pagination-button-people-umayknow"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {totalPages <= 5 ? (
            Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-button-people-umayknow ${currentPage === index + 1 ? 'active' : ''}`}
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
                    className="pagination-button-people-umayknow"
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
                    className={`pagination-button-people-umayknow ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              {currentPage < totalPages - 2 && (
                <>
                  <span className="pagination-ellipsis">...</span>
                  <button
                    className="pagination-button-people-umayknow"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </>
          )}
          <button
            className="pagination-button-people-umayknow"
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

export default PeopleUMayKnow;
