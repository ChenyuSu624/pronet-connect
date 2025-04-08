import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access navigation state
import { getAllEvents, getAttendedEvents, cancelAttendance, updateUser, updateEventDoc } from "../../services/userService"; // Update imports
import Navbar from '../Navbar/Navbar';
import './EventBoard.css';

const EventBoard = () => { // Remove userId from props
  const location = useLocation(); // Access navigation state
  const userId = location.state?.userId; // Retrieve userId from state

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attendedIndex, setAttendedIndex] = useState(0);

  useEffect(() => {
    if (!userId) {
      console.error("No userId provided to EventBoard");
      return;
    }

    getAllEvents()
      .then(events => {
        setAllEvents(events);
        setFeaturedEvents(events.slice(0, 3));
      })
      .catch(error => {
        console.error("Error fetching all events:", error);
      });

    getAttendedEvents(userId)
      .then(attended => {
        console.log("Fetched attended events:", attended);
        setAttendedEvents(attended);
      })
      .catch(error => {
        console.error("Error fetching attended events:", error);
      });
  }, [userId]);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEvents = allEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm)
    );
    setFeaturedEvents(filteredEvents.slice(0, 3));
    setCurrentIndex(0);
  };

  const handleRSVP = async (eventId) => {
    try {
      // Add eventId to user's attendedEvents
      const updatedAttendedEvents = [...attendedEvents, { id: eventId }];
      setAttendedEvents(updatedAttendedEvents);
      await updateUser(userId, { attendedEvents: updatedAttendedEvents.map(event => event.id) });

      // Add userId to event's attendees
      const event = allEvents.find(e => e.id === eventId);
      if (event) {
        const updatedAttendees = [...(event.attendees || []), userId];
        await updateEventDoc(eventId, { attendees: updatedAttendees }); // Use renamed function
        setAllEvents(allEvents.map(e => (e.id === eventId ? { ...e, attendees: updatedAttendees } : e))); // Update state
      }
    } catch (error) {
      console.error("Error RSVPing for event:", error);
    }
  };

  const handleCancelAttendance = async (eventId) => {
    if (window.confirm("Are you sure you want to cancel your attendance for this event?")) {
      try {
        // Remove eventId from user's attendedEvents
        const updatedAttendedEvents = attendedEvents.filter(event => event.id !== eventId);
        setAttendedEvents(updatedAttendedEvents);
        await updateUser(userId, { attendedEvents: updatedAttendedEvents.map(event => event.id) });

        // Remove userId from event's attendees
        const event = allEvents.find(e => e.id === eventId);
        if (event) {
          const updatedAttendees = (event.attendees || []).filter(id => id !== userId);
          await updateEventDoc(eventId, { attendees: updatedAttendees }); // Use renamed function
          setAllEvents(allEvents.map(e => (e.id === eventId ? { ...e, attendees: updatedAttendees } : e)));
        }
      } catch (error) {
        console.error("Error canceling attendance:", error);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex + 3 < allEvents.length) {
      setCurrentIndex(currentIndex + 3);
      setFeaturedEvents(allEvents.slice(currentIndex + 3, currentIndex + 6));
    }
  };

  const handlePrev = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3);
      setFeaturedEvents(allEvents.slice(currentIndex - 3, currentIndex));
    }
  };

  const handleAttendedNext = () => {
    if (attendedIndex + 3 < attendedEvents.length) {
      setAttendedIndex(attendedIndex + 3);
    }
  };

  const handleAttendedPrev = () => {
    if (attendedIndex - 3 >= 0) {
      setAttendedIndex(attendedIndex - 3);
    }
  };

  return (
    <div className="event-board">
      <Navbar onSearchChange={handleSearchChange} />
      <div className="header">
        <div className="header-left">
          <h1>Professional Events</h1>
          <p>Discover and connect at industry-leading events</p>
        </div>
        {/* <button className="create-event">+ Create Event</button> */}
      </div>
      <div className="featured-events">
        <h2>Featured Events</h2>
        <div className="event-carousel">
          <button
            className={`carousel-arrow left-arrow ${featuredEvents.length < 3 ? "hidden-arrow" : ""}`}
            onClick={handlePrev}
            disabled={currentIndex === 0 || featuredEvents.length < 3}
          >
            &#9664;
          </button>
          <div className="event-cards">
            {featuredEvents.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-info">
                  <p className="event-date">{event.date}</p>
                  <p className="event-location">{event.location}</p>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="event-footer">
                  <span>Attendees: {allEvents.find(e => e.id === event.id)?.attendees?.length || 0}</span>
                  {attendedEvents.some(attended => attended.id === event.id) ? (
                    <button className="cancel-button rsvp-button" onClick={() => handleCancelAttendance(event.id)}>Cancel</button>
                  ) : (
                    <button className="rsvp-button" onClick={() => handleRSVP(event.id)}>RSVP</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            className={`carousel-arrow right-arrow ${featuredEvents.length < 3 ? "hidden-arrow" : ""}`}
            onClick={handleNext}
            disabled={currentIndex + 3 >= allEvents.length || featuredEvents.length < 3}
          >
            &#9654;
          </button>
        </div>
      </div>
      <div className="attended-events">
        <h2>Attended Events</h2>
        <div className="attended-carousel">
          <button
            className={`attended-arrow left-arrow ${attendedEvents.length < 3 ? "hidden-arrow" : ""}`}
            onClick={handleAttendedPrev}
            disabled={attendedIndex === 0 || attendedEvents.length < 3}
          >
            &#9664;
          </button>
          <div className="attended-cards">
            {attendedEvents.slice(attendedIndex, attendedIndex + 3).map((event, index) => {
              const eventExists = allEvents.find(e => e.id === event.id);
              return (
                <div key={index} className="attended-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  {eventExists ? (
                    <div className="attended-info">
                      <p className="attended-date">{eventExists.date}</p>
                      <p className="attended-location">{eventExists.location}</p>
                      <h3>{eventExists.title}</h3>
                      <p>{eventExists.description}</p>
                    </div>
                  ) : (
                    <div className="attended-info" style={{ textAlign: "center" }}>
                      <p>This event is no longer available.</p>
                    </div>
                  )}
                  <div className="attended-footer">
                    <button className="cancel-button rsvp-button" onClick={() => handleCancelAttendance(event.id)}>Cancel</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className={`attended-arrow right-arrow ${attendedEvents.length < 3 ? "hidden-arrow" : ""}`}
            onClick={handleAttendedNext}
            disabled={attendedIndex + 3 >= attendedEvents.length || attendedEvents.length < 3}
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventBoard;
