import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADK9F7hgc5KKvQpOYkKYSJ6j0_e-C2j-M",
  authDomain: "ai-weather-8417d.firebaseapp.com",
  projectId: "ai-weather-8417d",
  storageBucket: "ai-weather-8417d.firebasestorage.app",
  messagingSenderId: "815073026198",
  appId: "1:815073026198:web:4f0c74e1de8a4f8f4862b7",
  measurementId: "G-RG19TJSHVH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
