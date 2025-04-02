import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfig";

// Add a new user to the "users" collection
export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    return { id: docRef.id, ...userData };
  } catch (error) {
    throw new Error("Error adding user: " + error.message);
  }
};

// Get all users from the "users" collection
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

// Get a single user by ID
export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

// Update a user by ID
export const updateUser = async (userId, updatedData) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, updatedData);
    return { id: userId, ...updatedData };
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef);
    return userId;
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();

    if (user.password !== password) {
      throw new Error("Invalid credentials");
    }

    return { id: userDoc.id, ...user };
  } catch (error) {
    throw new Error("Error logging in: " + error.message);
  }
};

/**
 * Fetch connection details by their IDs.
 * @param {Array<string>} connectionIds - Array of connection IDs.
 * @returns {Promise<Array<Object>>} - Promise resolving to an array of connection details.
 */
export const getConnectionsByIds = async (connectionIds) => {
  try {
    const connections = [];
    for (const id of connectionIds) {
      const docRef = doc(db, "users", id); // Fetch each connection by ID
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        connections.push({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.warn(`Connection with ID ${id} not found.`);
      }
    }
    return connections;
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
};

/**
 * Remove a connection between two users.
 * @param {string} userId - The ID of the current user.
 * @param {string} connectionId - The ID of the connection to remove.
 * @returns {Promise<void>}
 */
export const removeConnection = async (userId, connectionId) => {
  try {
    // Get the current user's document
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    // Get the connection user's document
    const connectionDocRef = doc(db, "users", connectionId);
    const connectionDocSnap = await getDoc(connectionDocRef);

    if (userDocSnap.exists() && connectionDocSnap.exists()) {
      const userConnections = userDocSnap.data().connections || [];
      const connectionConnections = connectionDocSnap.data().connections || [];

      // Remove the connection from both users
      const updatedUserConnections = userConnections.filter((id) => id !== connectionId);
      const updatedConnectionConnections = connectionConnections.filter((id) => id !== userId);

      // Update both users in the database
      await updateDoc(userDocRef, { connections: updatedUserConnections });
      await updateDoc(connectionDocRef, { connections: updatedConnectionConnections });
    } else {
      throw new Error("One or both users not found.");
    }
  } catch (error) {
    console.error("Error removing connection:", error);
    throw error;
  }
};

/**
 * Fetch users who are not in the current user's connection list.
 * @param {string} userId - The ID of the current user.
 * @returns {Promise<Array<Object>>} - Promise resolving to an array of non-connections.
 */
export const getNonConnections = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("User not found");
    }

    const userConnections = userDocSnap.data().connections || [];
    const userPendingRequests = userDocSnap.data().pendingFriendRequests || [];
    const allUsersSnapshot = await getDocs(collection(db, "users"));

    const nonConnections = [];
    allUsersSnapshot.forEach((doc) => {
      if (
        doc.id !== userId && // Exclude the current user
        !userConnections.includes(doc.id) && // Exclude existing connections
        !userPendingRequests.includes(doc.id) // Exclude users in pendingFriendRequests
      ) {
        const data = doc.data();
        nonConnections.push({
          id: doc.id,
          firstName: data.firstName || "Unknown",
          lastName: data.lastName || "User",
          jobTitle: data.jobTitle || "Unknown Job",
          company: data.company || "Unknown Company",
        });
      }
    });

    return nonConnections;
  } catch (error) {
    console.error("Error fetching non-connections:", error);
    return [];
  }
};

/**
 * Send a friend request by adding the current user's ID to the target user's pendingFriendRequests list.
 * @param {string} currentUserId - The ID of the current user.
 * @param {string} targetUserId - The ID of the target user.
 * @returns {Promise<void>}
 */
export const sendFriendRequest = async (currentUserId, targetUserId) => {
  try {
    const targetUserDocRef = doc(db, "users", targetUserId);
    const targetUserDocSnap = await getDoc(targetUserDocRef);

    if (!targetUserDocSnap.exists()) {
      throw new Error("Target user not found");
    }

    const pendingFriendRequests = targetUserDocSnap.data().pendingFriendRequests || [];
    if (!pendingFriendRequests.includes(currentUserId)) {
      pendingFriendRequests.push(currentUserId);
      await updateDoc(targetUserDocRef, { pendingFriendRequests });
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

/**
 * Fetch 4 random feeds from the feeds collection and include user details.
 * @returns {Promise<Array<Object>>} - Promise resolving to an array of 4 random feed objects with user details.
 */
export const getRandomFeeds = async () => {
  try {
    const feedsSnapshot = await getDocs(collection(db, "feeds"));
    const allFeeds = feedsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const shuffledFeeds = allFeeds.sort(() => 0.5 - Math.random()).slice(0, 4); // Shuffle and pick 4 feeds

    // Fetch user details for each feed
    const feedsWithUserDetails = await Promise.all(
      shuffledFeeds.map(async (feed) => {
        const userDoc = await getDoc(doc(db, "users", feed.userId));
        const user = userDoc.exists() ? userDoc.data() : { firstName: "Unknown", lastName: "User", jobTitle: "Unknown Job" };
        return { ...feed, user };
      })
    );

    return feedsWithUserDetails;
  } catch (error) {
    console.error("Error fetching random feeds:", error);
    throw error;
  }
};

/**
 * Fetch all feeds from the feeds collection and sort them by timestamp in descending order.
 * @returns {Promise<Array<Object>>} - Promise resolving to an array of feed objects with user details.
 */
export const getFeeds = async () => {
  try {
    const feedsQuery = query(collection(db, "feeds"), orderBy("timestamp", "desc")); // Query feeds sorted by timestamp
    const feedsSnapshot = await getDocs(feedsQuery);
    const feeds = feedsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Fetch user details for each feed
    const feedsWithUserDetails = await Promise.all(
      feeds.map(async (feed) => {
        if (!feed.userId) {
          console.warn(`Feed with ID ${feed.id} is missing userId`);
          return { ...feed, user: { firstName: "Unknown", lastName: "User", jobTitle: "Unknown Job" } };
        }
        const userDoc = await getDoc(doc(db, "users", feed.userId));
        const user = userDoc.exists() ? userDoc.data() : { firstName: "Unknown", lastName: "User", jobTitle: "Unknown Job" };
        return { ...feed, user };
      })
    );

    return feedsWithUserDetails;
  } catch (error) {
    console.error("Error fetching feeds:", error);
    throw error;
  }
};

/**
 * Add a new post to the feeds collection.
 * @param {Object} postData - The data of the post to be added.
 * @returns {Promise<Object>} - Promise resolving to the added post with its ID.
 */
export const addPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, "feeds"), postData);
    return { id: docRef.id, ...postData };
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

/**
 * Delete a post from the feeds collection.
 * @param {string} postId - The ID of the post to be deleted.
 * @returns {Promise<void>} - Promise resolving when the post is deleted.
 */
export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, "feeds", postId);
    await deleteDoc(postRef);
    console.log(`Post with ID ${postId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export default {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getConnectionsByIds,
  removeConnection, // Export the new function
  getNonConnections, // Export the new function
  sendFriendRequest, // Export the new function
  getRandomFeeds, // Export the new function
  getFeeds, // Export the new function
  addPost, // Export the new function
  deletePost, // Export the new function
};