import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig";
import Navbar from '../Navbar/Navbar'; // Import Navbar
import './EventBoard.css';

const EventBoard = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // Store all events for filtering
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index for navigation

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllEvents(events); // Store all events
        setFeaturedEvents(events.slice(0, 3)); // Initially display the first 3 events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEvents = allEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm)
    );
    setFeaturedEvents(filteredEvents.slice(0, 3)); // Update featured events dynamically
    setCurrentIndex(0); // Reset index when filtering
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

  return (
    <div className="event-board">
      <Navbar onSearchChange={handleSearchChange} /> {/* Pass search handler to Navbar */}
      <div className="header">
        <div className="header-left">
          <h1>Professional Events</h1>
          <p>Discover and connect at industry-leading events</p>
        </div>
        <button className="create-event">+ Create Event</button>
      </div>
      <div className="featured-events">
        <h2>Featured Events</h2>
        <div className="event-carousel">
          <button className="carousel-arrow left-arrow" onClick={handlePrev} disabled={currentIndex === 0}>
            &#9664; {/* Left arrow */}
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
                  <span>Attendees: {event.attendees.length || 0} </span>
                  <button className="rsvp-button">RSVP</button>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-arrow right-arrow" onClick={handleNext} disabled={currentIndex + 3 >= allEvents.length}>
            &#9654; {/* Right arrow */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventBoard;
