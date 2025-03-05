import "./js/auth.js";          // Handles login, signup, and logout
import "./js/firebase.js";      // Handles Firestore data
import "./js/navigation.js";    // Handles navigation and UI updates
import "./js/subscriptions.js"; // Handles Stripe payments
import "./js/pwa.js";           // Handles Progressive Web App features

// Initialize Firebase Auth
const auth = getAuth();

// Export auth for other files to use
export { auth };