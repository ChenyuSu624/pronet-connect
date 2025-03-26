import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Signup.css';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../../services/userService.js'; // Import addUser function

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    jobTitle: '',
    industry: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setError(''); // Clear any previous error messages

    const userData = {
      ...formData,
      bio: "", // Default value for bio
      connections: [], // Default value for connections
      profilePicture: "", // Default value for profilePicture
      profileViews: 0, // Default value for profileViews
    };

    try {
      const user = await addUser(userData);
      console.log('Sign-up successful:', user);
      // Redirect to the login page or another page after successful sign-up
      navigate('/');
    } catch (err) {
      console.error('Sign-up failed:', err.message);
      setError(err.message); // Display error message to the user
    }
  };

  return (
    <div className="signup-container">
      <Navbar />
      <main className="signup-main">
        <h1>Join ProNet Connect</h1>
        <p>Connect with professionals, grow your network, and advance your career</p>
        {error && <p className="error-message">{error}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="">Select your industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              {/* Add more options here */}
            </select>
          </div>
          <div className="form-group-inline">
            <label>
              <input type="checkbox" required />
              I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="create-account-btn">Create Account</button>
        </form>
        <div className="signin-link">
            <p className="signup-footer-text">
              Already have an account? <Link to="/">Sign In</Link>
            </p>
          </div>
        <div className="social-signup">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button className="google-btn">
              <FaGoogle style={{ fontSize: '18px', marginRight: '5px' }} /> Google
            </button>
            <button className="linkedin-btn">
              <FaLinkedin style={{ fontSize: '18px', marginRight: '5px' }} /> LinkedIn
            </button>
          </div>
        </div>
      </main>
      <footer className="signup-footer">
        <p>&copy; 2025 ProNet Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Signup;
