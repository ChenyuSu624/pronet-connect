import React, { useState, useEffect, useRef } from 'react';
import './MessageWindow.css';
import { getOrCreateChat, sendMessage, listenToMessages, checkChatExists } from '../../services/chatService';

const MessageWindow = ({ connection, currentUser, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(null);
  const messageBodyRef = useRef(null); // Reference for the message body

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentUser?.id || !connection?.id) {
        console.error("Missing user IDs for chat initialization.");
        return;
      }

      const existingChat = await checkChatExists(currentUser.id, connection.id);
      if (existingChat) {
        setChatId(existingChat.id); // Use the existing chat ID
      } else {
        const newChatId = await getOrCreateChat(currentUser.id, connection.id);
        setChatId(newChatId); // Create a new chat if it doesn't exist
      }
    };

    initializeChat();
  }, [currentUser?.id, connection?.id]);

  useEffect(() => {
    if (!chatId) return;

    // Listen for real-time updates to messages
    const unsubscribe = listenToMessages(chatId, (newChatHistory) => {
      setChatHistory(newChatHistory);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [chatId]);

  useEffect(() => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTop = messageBodyRef.current.scrollHeight;
    }
  }, [chatHistory]); // Scroll to the bottom whenever chatHistory updates

  const handleSendMessage = async () => {
    if (message.trim() && chatId) {
      await sendMessage(chatId, currentUser.id, message);
      setMessage(''); // Clear the input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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
        <h3>{connection?.firstName} {connection?.lastName}</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="message-body" ref={messageBodyRef}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`message ${chat.senderId === currentUser.id ? 'sent' : 'received'}`}
          >
            <span className="sender-label">
              {chat.senderId === currentUser.id ? 'You' : connection?.firstName}:
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
          onKeyPress={handleKeyPress} // Bind Enter key to send message
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageWindow;
