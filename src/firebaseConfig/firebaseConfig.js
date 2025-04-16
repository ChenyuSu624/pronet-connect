import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDUiED5eo7S3o8e5i-IgcjXW4JqVIIitGo",
    authDomain: "pronet-connect-840da.firebaseapp.com",
    projectId: "pronet-connect-840da",
    storageBucket: "pronet-connect-840da.firebasestorage.app",
    messagingSenderId: "512096793576",
    appId: "1:512096793576:web:d54622e6e9102128816a5d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };