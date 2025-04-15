import React, { useState, useEffect } from 'react';
import './MessageWindow.css';
import { getOrCreateChat, sendMessage, listenToMessages, checkChatExists } from '../../services/chatService';

const MessageWindow = ({ connection, currentUser, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      const existingChat = await checkChatExists(currentUser.id, connection.id);
      if (existingChat) {
        setChatId(existingChat.id); // Use the existing chat ID
      } else {
        const newChatId = await getOrCreateChat(currentUser.id, connection.id);
        setChatId(newChatId); // Create a new chat if it doesn't exist
      }

      // Listen for real-time updates to messages
      const unsubscribe = listenToMessages(chatId, setChatHistory);
      return () => unsubscribe(); // Cleanup listener on component unmount
    };

    initializeChat();
  }, [currentUser.id, connection.id, chatId]);

  const handleSendMessage = async () => {
    if (message.trim() && chatId) {
      await sendMessage(chatId, currentUser.id, message);
      setMessage(''); // Clear the input field
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="message-window">
      <div className="message-header">
        <h3>{connection.firstName} {connection.lastName}</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="message-body">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`message ${chat.senderId === currentUser.id ? 'sent' : 'received'}`}
          >
            <span className="sender-label">
              {chat.senderId === currentUser.id ? 'You' : connection.firstName}:
            </span> 
            {chat.text}
            <div className="timestamp">
              {formatTimestamp(chat.timestamp)}
            </div>
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
