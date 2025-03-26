import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

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