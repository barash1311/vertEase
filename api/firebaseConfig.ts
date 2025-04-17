import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDKVQ-3S48-PNhPQVWdEoOaCBI4qbPdddA",
    authDomain: "inkrit-3ebcf.firebaseapp.com",
    databaseURL: "https://inkrit-3ebcf-default-rtdb.firebaseio.com",
    projectId: "inkrit-3ebcf",
    storageBucket: "inkrit-3ebcf.appspot.com",
    messagingSenderId: "440105175644",
    appId: "1:440105175644:web:d2c8a63530207a38e67499",
    measurementId: "G-5S36EFQKVM"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };