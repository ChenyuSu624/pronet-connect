import React from 'react';
import './EventBoard.css';

const EventBoard = () => {
  const featuredEvents = [
    {
      title: 'Tech Innovation Summit 2025',
      date: 'Mar 15, 2025',
      location: 'San Francisco, CA',
      description: 'Join industry leaders for insights on emerging technologies and networking opportunities.',
      attendees: 42,
    },
    {
      title: 'Leadership Excellence Forum',
      date: 'Apr 5, 2025',
      location: 'New York, NY',
      description: 'A premier gathering of business leaders sharing strategies for success.',
      attendees: 28,
    },
    {
      title: 'Startup Pitch Night',
      date: 'May 20, 2025',
      location: 'Austin, TX',
      description: 'Watch innovative startups pitch their ideas to top investors and industry experts.',
      attendees: 35,
    },
  ];

  const upcomingEvents = [
    {
      title: 'Digital Marketing Masterclass',
      date: 'Mar 25',
      time: '2:00 PM - 5:00 PM',
      location: 'Virtual Event',
      price: '$49.99',
    },
    {
      title: 'AI in Business Workshop',
      date: 'Apr 2',
      time: '10:00 AM - 4:00 PM',
      location: 'Chicago, IL',
      price: '$199.99',
    },
    {
      title: 'Women in Tech Conference',
      date: 'Apr 15',
      time: '9:00 AM - 6:00 PM',
      location: 'Seattle, WA',
      price: '$299.99',
    },
  ];

  return (
    <div className="event-board">
      <div className="header">
        <h1>Professional Events</h1>
        <p>Discover and connect at industry-leading events</p>
        <button className="create-event">+ Create Event</button>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search events..." />
        <button>Location</button>
        <button>Date</button>
        <button>Category</button>
      </div>
      <div className="featured-events">
        <h2>Featured Events</h2>
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
                <span>{event.attendees} attendees</span>
                <button className="rsvp-button">RSVP</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="upcoming-events">
        <h2>Upcoming Events</h2>
        <ul>
          {upcomingEvents.map((event, index) => (
            <li key={index} className="upcoming-event">
              <div className="event-date">{event.date}</div>
              <div className="event-details">
                <h4>{event.title}</h4>
                <p>{event.time} • {event.location}</p>
              </div>
              <div className="event-price">
                <span>{event.price}</span>
                <button className="register-button">Register</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventBoard;
