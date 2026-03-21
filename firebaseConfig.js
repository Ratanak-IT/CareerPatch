import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBudnjbU0-a6OEpwNgxM4t6JodGIHgfD7Y",
  authDomain: "careerpatch-3f47f.firebaseapp.com",
  projectId: "careerpatch-3f47f",
  storageBucket: "careerpatch-3f47f.firebasestorage.app",
  messagingSenderId: "1026850803558",
  appId: "1:1026850803558:web:2dcb041e1a0a1acbadc2a7",
  measurementId: "G-7L3VNR94DC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);