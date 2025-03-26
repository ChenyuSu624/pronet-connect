import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ForgotPassword.css'; // Import the CSS file for styling
import { FaLock } from 'react-icons/fa'; // Import the lock icon from react-icons

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the forgot password logic here
        setMessage('If this email is registered, you will receive a password reset link.');
    };

    const handleLoginClick = () => {
        navigate('/'); // Navigate to the login panel
    };

    return (
        <div className="forgot-password-container no-background">
            <div className="forgot-password-card">
                <FaLock className="lock-icon" /> {/* Add the lock icon */}
                <h2>Forgot Password?</h2>
                <p>Enter your email address to reset your password</p>
                <form onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Send Reset Link</button>
                </form>
                {message && <p className="message">{message}</p>}
                <div className="links">
                    <p>Remember your password? <a onClick={handleLoginClick} style={{ cursor: 'pointer' }}>Log in</a></p>
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
            </div>
            <p className="support-link">Need help? <a href="/contact-support">Contact Support</a></p>
        </div>
    );
};

export default ForgotPassword;
