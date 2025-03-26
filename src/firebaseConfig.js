import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyALI4aMl74uOTa00x1ujGvDSuQkU_SQEKs",
    authDomain: "pronet-connect-firebase.firebaseapp.com",
    projectId: "pronet-connect-firebase",
    storageBucket: "pronet-connect-firebase.firebasestorage.app",
    messagingSenderId: "724552509061",
    appId: "1:724552509061:web:ee22c092ed4d43dc136bec"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };