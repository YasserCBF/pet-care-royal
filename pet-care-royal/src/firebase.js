import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "pet-care-royal.firebaseapp.com",
  projectId: "pet-care-royal",
  storageBucket: "pet-care-royal.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);