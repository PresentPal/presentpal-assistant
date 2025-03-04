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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("Firebase Initialized:", auth);

// Get the button that opens the modal
var btn = document.getElementById("accountButton");

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
window.signUp = function() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return; // Stop function if passwords do not match
  }

  // Proceed with account creation
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Your account has been created.");
      closeAccountModal();
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
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

// ✅ Monitor Authentication State Change
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
  } else {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("logoutButton").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("accountModal");
  const span = document.querySelector(".close");

  // ✅ Android Bubble: Adds to Home Screen
    const androidBubble = document.getElementById("androidBubble");
    
    if (androidBubble) {
        androidBubble.addEventListener("click", () => {
            androidBubble.style.display = "none";
        });
    }

  // ✅ Account Button: Opens Modal
  document.getElementById("accountButton").addEventListener("click", function () {
    modal.style.display = "block";
  });

  // ✅ Home Button Navigation
  const homeButton = document.getElementById("homeButton");
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      window.location.href = "https://presentpal.uk";
    });
  }

  // ✅ Upgrade Button Navigation
  const upgradeButton = document.getElementById("upgradeButton");
  if (upgradeButton) {
    upgradeButton.addEventListener("click", function () {
      window.location.href = "subscription-plans.html"; // Update with the correct URL if needed
    });
  }

  // ✅ Close Modal when clicking 'X'
  span.onclick = function () {
    modal.style.display = "none";
  };

  // ✅ Close Modal when clicking outside
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});


// ✅ PWA Installation Handling
let deferredPrompt;
const iosInstructions = document.getElementById('iosInstructions');
const androidBubble = document.getElementById('androidBubble');
const closeBubble = document.getElementById('closeBubble');

// Function to check if PWA is installed
function isPWAInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Hide instructions if already installed
function checkInstallationStatus() {
    if (isPWAInstalled()) {
        iosInstructions.style.display = 'none';
        androidBubble.style.display = 'none';
    }
}

// Run the check on page load
checkInstallationStatus();

// Detect iOS
const userAgent = window.navigator.userAgent;
if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    iosInstructions.style.display = 'block'; // Show iOS instructions at the top
}

// Handle beforeinstallprompt for Android
if (!isPWAInstalled()) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        androidBubble.style.display = 'block'; // Show floating speech bubble for Android
    });

    androidBubble.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User installed the app');
                    androidBubble.style.display = 'none'; // Hide after installation
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        }
    });

    closeBubble.addEventListener('click', (event) => {
        event.stopPropagation();
        androidBubble.style.display = 'none'; // Hide when "Hide" is clicked
    });
}

// Hide iOS instructions if installed
if (isPWAInstalled() && iosInstructions.style.display !== 'none') {
    iosInstructions.style.display = 'none';
}

// ✅ Initialize Stripe (Replace with your actual publishable key)
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
}

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