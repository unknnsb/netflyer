import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAQ7eRHwZhGj-yXbA3258KQoAwGs3ygRK0',
  authDomain: 'netflyer-5aac5.firebaseapp.com',
  projectId: 'netflyer-5aac5',
  storageBucket: 'netflyer-5aac5.appspot.com',
  messagingSenderId: '1004016639295',
  appId: '1:1004016639295:web:d3392a84b5a0f648d8878a',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore(app)
