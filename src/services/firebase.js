// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBudnjbU0-a6OEpwNgxM4t6JodGIHgfD7Y",
  authDomain: "careerpatch-3f47f.firebaseapp.com",
  projectId: "careerpatch-3f47f",
  storageBucket: "careerpatch-3f47f.firebasestorage.app",
  messagingSenderId: "1026850803558",
  appId: "1:1026850803558:web:2dcb041e1a0a1acbadc2a7",
  measurementId: "G-7L3VNR94DC",
};

export const app = initializeApp(firebaseConfig);

// ✅ Analytics: optional + safe
export let analytics = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

// 🔐 Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();