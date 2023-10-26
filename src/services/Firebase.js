import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQ7eRHwZhGj-yXbA3258KQoAwGs3ygRK0",
  authDomain: "netflyer-5aac5.firebaseapp.com",
  projectId: "netflyer-5aac5",
  storageBucket: "netflyer-5aac5.appspot.com",
  messagingSenderId: "1004016639295",
  appId: "1:1004016639295:web:d3392a84b5a0f648d8878a",
  measurementId: "G-YMSYD51ENW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
