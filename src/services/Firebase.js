import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "netflyer-5aac5.firebaseapp.com",
  projectId: "netflyer-5aac5",
  storageBucket: "netflyer-5aac5.appspot.com",
  messagingSenderId: "1004016639295",
  appId: APP_ID,
  measurementId: "G-YMSYD51ENW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
