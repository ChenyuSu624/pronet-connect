import React, { useState } from 'react';
import { FaGoogle, FaLinkedin, FaUserTie, FaBriefcase, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPanel.css';
import axios from 'axios'; // Import axios for API calls
import { loginUser } from '../../services/userService.js'; // Import loginUser function

const LoginPanel = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState(false); // State to track input error

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setError(''); // Clear any previous error messages
    setInputError(false); // Reset input error state

    if (!email || !password) {
      setError('Email and password are required');
      setInputError(true); // Highlight input boxes in red
      return;
    }

    try {
      const user = await loginUser(email, password);
      console.log('Sign-in successful:', user);
      // Redirect to the dashboard or another page after successful login
      navigate('/dashboard', { state: { userId: user.id } }); // Pass user ID to Dashboard
    } catch (err) {
      console.error('Sign-in failed:', err.message);
      setError(err.message); // Display error message to the user
      setInputError(true); // Highlight input boxes in red
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault(); // Prevent default navigation behavior
    if (!email) {
      alert('Please enter your email before proceeding to forgot password.');
      return;
    }
    navigate('/forgotpassword');
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setInputError(false); // Reset input error state when user modifies input
  };

  return (
    <div className="login-container">
      <div className="login-panel">
        <div className="login-left">
          <h1>ProNet Connect</h1>
          <p>Connect, grow, and advance your professional journey with the network that works for you.</p>
          <ul>
            <li>
              <FaUserTie className="icon" /> Connect with industry professionals
            </li>
            <li>
              <FaBriefcase className="icon" /> Discover career opportunities
            </li>
            <li>
              <FaUsers className="icon" /> Join professional communities
            </li>
          </ul>
          <div className="login-footer">
            <img src="../img/woman.png" alt="User 1" />
            <img src="../img/asian.png" alt="User 2" />
            <img src="../img/whiteman.png" alt="User 3" />
            <span>Join 1M+ professionals</span>
          </div>
        </div>
        <div className="login-right">
          <h2>Welcome back</h2>
          <p>Sign in to your account</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignIn}>
            <label>Email address</label>
            <input 
              type="text" 
              placeholder="Enter your email" 
              value={email} 
              onChange={handleInputChange(setEmail)} // Use handleInputChange
              className={`login-input ${inputError ? 'input-error' : ''}`} 
            />
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={handleInputChange(setPassword)} // Use handleInputChange
              className={`login-input ${inputError ? 'input-error' : ''}`} 
            />
            <div className="login-options">
              <div className="remember-me">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <button 
                type="button" 
                onClick={handleForgotPassword} 
                className="forgot-password-button"
              >
                Forgot password
              </button>
            </div>
            <button type="submit" className="signin-button">Sign in</button> {/* Ensure type="submit" */}
          </form>
          <div className="login-alternatives">
            <p>Or continue with</p>
            <div className="linked-buttons" style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
              <button className="google-button">
                <FaGoogle className="icon" style={{ fontSize: '18px' }} />
                <span>Google</span>
              </button>
              <button className="linkedin-button">
                <FaLinkedin className="icon" style={{ fontSize: '18px' }} />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>
          <div className="signup-link">
            <p>Don't have an account? <Link to="/signup">Sign up for free</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
