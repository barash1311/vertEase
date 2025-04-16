import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD9Xo_X5jcljHIJuG39U09P9D_UtI9qIEs",
    authDomain: "vertease.firebaseapp.com",
    projectId: "vertease",
    storageBucket: "vertease.firebasestorage.app",
    messagingSenderId: "841290002594",
    appId: "1:841290002594:web:75e064cd7611718ff5a7fb",
    measurementId: "G-WRV2BN9RS7"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
