// ✅ Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHKBY8jlUy2X6V-UJBqV8loINe5it73XQ",
  authDomain: "presentpal-9c74e.firebaseapp.com",
  projectId: "presentpal-9c74e",
  storageBucket: "presentpal-9c74e.appspot.com",
  messagingSenderId: "371923843440",
  appId: "1:371923843440:web:333893e3d3856e209937b5",
  measurementId: "G-CF3XL2YYQ2"
};

import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

console.log("Firebase Initialized:", auth);

// ✅ Global close modal function
window.closeAccountModal = function () {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none";
  }
};

// ✅ Toggle password visibility function (global)
window.togglePasswordVisibility = function(fieldId, iconId) {
  const passwordField = document.getElementById(fieldId);
  const toggleIcon = document.getElementById(iconId);

  if (passwordField.type === "password") {
    passwordField.type = "text"; // Show password
    toggleIcon.textContent = "👁️‍🗨️"; // Open eye icon
  } else {
    passwordField.type = "password"; // Hide password
    toggleIcon.textContent = "👁‍🗨"; // Closed eye icon
  }
};

// ✅ Login Function Global Accessability
window.login = function() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            closeAccountModal();
        });
};

// ✅ Global Firebase Email/Password Signup
window.signUp = async function() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Store user data in Firestore (default to "free" subscription)
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      subscription: "free" // Default to "free"
    });

    alert("Your account has been created.");
    closeAccountModal();
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

// ✅ Global Function to Show Login Form
window.showLoginForm = function() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";

  // Correct toggle visibility
  document.getElementById("loginFormToggle").style.display = "block"; // Show sign-up toggle
  document.getElementById("signupFormToggle").style.display = "none"; // Hide login toggle
};

// ✅ Global Function to Show Sign Up Form
window.showSignUpForm = function() {
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";

  // Correct toggle visibility
  document.getElementById("signupFormToggle").style.display = "block"; // Show login toggle
  document.getElementById("loginFormToggle").style.display = "none"; // Hide sign-up toggle
};

// ✅ Ensure logout function is globally accessible
window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("✅ Logged out successfully!");
      closeAccountModal();

    // Clear input fields
   document.getElementById("loginEmail").value = "";
   document.getElementById("loginPassword").value = "";
   document.getElementById("signupEmail").value = "";
   document.getElementById("signupPassword").value = "";
   document.getElementById("confirmPassword").value = "";

    });
};

// ✅ Check User Subscription Status
function checkSubscriptionStatus(user) {
    if (!user) return;

    // Fetch user's subscription status from Firestore
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.subscription === "subscribedUser") { // Check for "subscribedUser"
                document.getElementById("dashboardButton").style.display = "block"; // Show dashboard button for subscribed users
            } else {
                document.getElementById("dashboardButton").style.display = "none"; // Hide dashboard button for non-subscribed users
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

onAuthStateChanged(auth, (user) => {
  const dashboardButton = document.getElementById("dashboardButton");

  if (user) {
    checkSubscriptionStatus(user); // Check subscription status when user is logged in

    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
  } else {
    dashboardButton.style.display = "none"; // Hide the dashboard button when logged out
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("logoutButton").style.display = "none";
  }
});

// ✅ Add Event Listener for Dashboard Button
document.addEventListener("DOMContentLoaded", function () {
    const dashboardButton = document.getElementById("dashboardButton");
    if (dashboardButton) {
        dashboardButton.addEventListener("click", function () {
            window.location.href = "dashboard.html"; // Redirect to the dashboard page
        });
    }
});

// ✅ PWA Installation Handling
let deferredPrompt;
const iosInstructions = document.getElementById('iosInstructions');
const closeBubble = document.getElementById('closeBubble');

// Function to check if PWA is installed
function isPWAInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Hide instructions if already installed
function checkInstallationStatus() {
    if (isPWAInstalled()) {
        iosInstructions.style.display = 'none';
    }
}

// Run the check on page load
checkInstallationStatus();

// Detect iOS
const userAgent = window.navigator.userAgent;
if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    iosInstructions.style.display = 'block'; // Show iOS instructions at the top
}
/*
// ✅ Stripe Integration
const stripe = Stripe("pk_live_51QxPo8L0iXZqwWyU2C3C2Uvro0Vqnyx1ConBqFZMRXP98UxTHKezDnvvFPurXS9KDWih5o0IAD7fGxhGs8UfYmge00isnX5Q5s");

// ✅ Function to Redirect to Stripe Checkout
function redirectToCheckout(priceId) {
    stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: "subscription", // Subscription mode for recurring payments
        successUrl: "https://presentpal.uk/success.html", // Redirect after successful payment
        cancelUrl: "https://presentpal.uk/subscription-plans.html" // Redirect if user cancels payment
    }).then((result) => {
        if (result.error) {
            alert(result.error.message);
        }
    });
} */

// ✅ Add Event Listeners for Subscription Buttons
document.addEventListener("DOMContentLoaded", function () {
    const selectPlus = document.getElementById("selectPlus");
    const selectPremium = document.getElementById("selectPremium");

    if (selectPlus) {
        selectPlus.addEventListener("click", function () {
            redirectToCheckout("price_1QxRLML0iXZqwWyU8I15Elna"); // Replace with your Stripe Price ID for Plus
        });
    }

    if (selectPremium) {
        selectPremium.addEventListener("click", function () {
            redirectToCheckout("price_1QxRTTL0iXZqwWyUNyWg3oPh"); // Replace with your Stripe Price ID for Premium
        });
    }
});
