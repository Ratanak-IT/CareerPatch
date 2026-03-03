import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ your config
const firebaseConfig = {
  apiKey: "AIzaSyBudnjbU0-a6OEpwNgxM4t6JodGIHgfD7Y",
  authDomain: "careerpatch-3f47f.firebaseapp.com",
  projectId: "careerpatch-3f47f",
  storageBucket: "careerpatch-3f47f.firebasestorage.app",
  messagingSenderId: "1026850803558",
  appId: "1:1026850803558:web:c06a2166e7dd6928adc2a7",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();