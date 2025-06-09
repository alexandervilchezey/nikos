// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJ_LrvyuzvpwBy3XnY_xhOrN2qXMLylv8",
  authDomain: "nikosperu-store.firebaseapp.com",
  projectId: "nikosperu-store",
  storageBucket: "nikosperu-store.firebasestorage.app",
  messagingSenderId: "63793384667",
  appId: "1:63793384667:web:cbc4442746cd7d6d4ad0fe",
  measurementId: "G-ZVW2ZY9Y21"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
