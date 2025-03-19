import "./js/auth.js";          // Handles login, signup, and logout
import "./js/firebase.js";      // Handles Firestore data
import "./js/navigation.js";    // Handles navigation and UI updates
import "./js/subscriptions.js"; // Handles Stripe payments
import "./js/pwa.js";           // Handles Progressive Web App features
import "./js/dashboard.js"; 

// In index.js
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

// Initialize Firebase Auth
const auth = getAuth();

// Export auth for other files to use
export { auth };
