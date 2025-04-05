import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCw1QqfUJmduK9aDnwEsMF-4ut0vTfs_Gw",
    authDomain: "vertigo-70778.firebaseapp.com",
    projectId: "vertigo-70778",
    storageBucket: "vertigo-70778.firebasestorage.app",
    messagingSenderId: "244173815393",
    appId: "1:244173815393:web:d954bd4ab16b1d2050b420",
    measurementId: "G-JJM9VQE1PV"
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