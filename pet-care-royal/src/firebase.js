import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrUkg21-p81haD-5qu1cNjy3fyaucAank",
  authDomain: "pet-care-royal.firebaseapp.com",
  projectId: "pet-care-royal",
  storageBucket: "pet-care-royal.firebasestorage.app",
  messagingSenderId: "13005705063",
  appId: "1:13005705063:web:98d82c682f65535ddce9c2",
  measurementId: "G-PSFJC1HLHN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);