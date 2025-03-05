// ✅ Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "presentpal-9c74e.firebaseapp.com",
  projectId: "presentpal-9c74e",
  storageBucket: "presentpal-9c74e.appspot.com",
  messagingSenderId: "371923843440",
  appId: "1:371923843440:web:333893e3d3856e209937b5",
  measurementId: "G-CF3XL2YYQ2"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export Firebase services for use in other files
export { app, auth, provider, db };
