// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ ADD

const firebaseConfig = {
  apiKey: "AIzaSyBudnjbU0-a6OEpwNgxM4t6JodGIHgfD7Y",
  authDomain: "careerpatch-3f47f.firebaseapp.com",
  projectId: "careerpatch-3f47f",
  storageBucket: "careerpatch-3f47f.appspot.com",
  messagingSenderId: "1026850803558",
  appId: "1:1026850803558:web:2dcb041e1a0a1acbadc2a7",
  measurementId: "G-7L3VNR94DC",
};

export const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// ✅ storage
export const storage = getStorage(app);