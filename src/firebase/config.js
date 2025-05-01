// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABnfAgdz71I3RkpSEKCfCuGt9HiDQNA2I",
  authDomain: "cantina-fasupi.firebaseapp.com",
  projectId: "cantina-fasupi",
  storageBucket: "cantina-fasupi.firebasestorage.app",
  messagingSenderId: "491449849886",
  appId: "1:491449849886:web:33444acb9b158e28e1f60f",
  measurementId: "G-KF3F87428V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {db, analytics};