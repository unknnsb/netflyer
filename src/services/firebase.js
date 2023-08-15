import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FIREBASE_APIKEY
if (!apiKey) {
  throw new Error('Missing Firebase Api Key')
}

const firebaseConfig = {
  apiKey,
  authDomain: 'netflyer-5aac5.firebaseapp.com',
  projectId: 'netflyer-5aac5',
  storageBucket: 'netflyer-5aac5.appspot.com',
  messagingSenderId: '1004016639295',
  appId: '1:1004016639295:web:d3392a84b5a0f648d8878a',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
