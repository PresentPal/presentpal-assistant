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

// ✅ Toggle password visibility function (global)
window.togglePasswordVisibility = function(fieldId, iconId) {
  const passwordField = document.getElementById(fieldId);
  const toggleIcon = document.getElementById(iconId);

  if (passwordField.type === "password") {
    passwordField.type = "text"; // Show password
    toggleIcon.textContent = "👁"; // Open eye icon
  } else {
    passwordField.type = "password"; // Hide password
    toggleIcon.textContent = "👁‍🗨"; // Closed eye icon
  }
};

// ✅ Global close modal function
window.closeAccountModal = function () {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none";
  }
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("Firebase Initialized:", auth);

// Get the modal
var modal = document.getElementById("accountModal");

// Get the button that opens the modal
var btn = document.getElementById("accountButton");

// Get the <span> element that closes the modal
var span = document.querySelector(".close");

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

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

  // Check current type of the password field and toggle it
  if (passwordField.type === "password") {
    passwordField.type = "text";
    confirmPasswordField.type = "text";
  } else {
    passwordField.type = "password";
    confirmPasswordField.type = "password";
  }

// ✅ Event Listener for Account Button
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("accountButton").addEventListener("click", function () {
    document.getElementById("accountModal").style.display = "block";
  });
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
