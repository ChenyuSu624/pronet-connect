import { db } from "../firebaseConfig/firebaseConfig";
import { collection, doc, getDoc, setDoc, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

/**
 * Get or create a chat document for two participants.
 * @param {string} userId1 - The ID of the first user.
 * @param {string} userId2 - The ID of the second user.
 * @returns {Promise<string>} - The chatId of the created or existing chat.
 */
export const getOrCreateChat = async (userId1, userId2) => {
  const chatId = [userId1, userId2].sort().join("_"); // Generate a unique chatId
  const chatDocRef = doc(db, "chats", chatId);

  const chatDocSnap = await getDoc(chatDocRef);
  if (!chatDocSnap.exists()) {
    // Create the chat document if it doesn't exist
    await setDoc(chatDocRef, {
      participants: [userId1, userId2],
      createdAt: new Date().toISOString(), // Save timestamp as a string
    });
  }

  return chatId;
};

/**
 * Check if a chat already exists and fetch its data.
 * @param {string} userId1 - The ID of the first user.
 * @param {string} userId2 - The ID of the second user.
 * @returns {Promise<Object|null>} - The chat data if it exists, otherwise null.
 */
export const checkChatExists = async (userId1, userId2) => {
  const chatId = [userId1, userId2].sort().join("_"); // Generate a unique chatId
  const chatDocRef = doc(db, "chats", chatId);

  const chatDocSnap = await getDoc(chatDocRef);
  if (chatDocSnap.exists()) {
    return { id: chatDocSnap.id, ...chatDocSnap.data() }; // Return chat data if it exists
  }
  return null; // Return null if the chat does not exist
};

/**
 * Send a message in a chat.
 * @param {string} chatId - The ID of the chat.
 * @param {string} senderId - The ID of the sender.
 * @param {string} text - The message text.
 * @returns {Promise<void>}
 */
export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messageId = uuidv4(); // Generate a unique message ID
  await setDoc(doc(messagesRef, messageId), {
    senderId,
    text,
    timestamp: new Date().toISOString(), // Save timestamp as a string
  });
};

/**
 * Listen for real-time updates to messages in a chat.
 * @param {string} chatId - The ID of the chat.
 * @param {function} callback - A callback function to handle new messages.
 * @returns {function} - A function to unsubscribe from the listener.
 */
export const listenToMessages = (chatId, callback) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

// Firebase Setup: Ensure you have a Firebase project set up and configured. The db import refers to the Firebase Firestore instance, which should be initialized in a firebase.js file.
// Firestore Structure: The Firestore database should have a chats collection, where each chat document is identified by a unique chatId (e.g., user1_user2). Each chat document contains a messages subcollection to store individual messages.
// Real-Time Updates: The onSnapshot function listens for real-time updates to the messages in the Firestore database.