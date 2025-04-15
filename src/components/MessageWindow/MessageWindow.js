import React, { useState } from 'react';
import './MessageWindow.css'; // Import styles for the message window

const MessageWindow = ({ connection, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // State to store chat history

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { sender: 'You', text: message }]); // Add message to chat history
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="message-window">
      <div className="message-header">
        <h3>{connection.firstName} {connection.lastName}</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="message-body">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message ${chat.sender === 'You' ? 'sent' : 'received'}`}>
            {chat.text} <strong>: {chat.sender}</strong>
          </div>
        ))}
      </div>
      <div className="message-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageWindow;
