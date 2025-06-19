// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJ_LrvyuzvpwBy3XnY_xhOrN2qXMLylv8",
  authDomain: "nikosperu-store.firebaseapp.com",
  projectId: "nikosperu-store",
  storageBucket: "nikosperu-store.firebasestorage.app",
  messagingSenderId: "63793384667",
  appId: "1:63793384667:web:cbc4442746cd7d6d4ad0fe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { db, auth, storage };