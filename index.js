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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("Firebase Initialized:", auth);

// ✅ Login Function Global Accessability
window.login = function() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("✅ Logged in successfully!");
            closeAccountModal();
        })
        .catch((error) => {
            alert("❌ Login failed: " + error.message);
        });
};

// ✅ Function to Show Login Form
function showLoginForm() {
    const loginBtn = document.getElementById("loginToggleBtn");
    const signupBtn = document.getElementById("signupToggleBtn");

    if (!loginBtn || !signupBtn) {
        console.error("❌ Elements not found! Check if loginToggleBtn and signupToggleBtn exist.");
        return;
    }

    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
}

// ✅ Function to Show Sign Up Form
function showSignUpForm() {
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupToggleBtn").classList.add("active");
  document.getElementById("loginToggleBtn").classList.remove("active");
}

// ✅ Close Modal
function closeAccountModal() {
  document.getElementById("accountModal").style.display = "none";
}

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

// ✅ Firebase Email/Password Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Logged in successfully!");
      closeAccountModal();
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

// ✅ Firebase Email/Password Signup
function signUp() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Account created successfully!");
      closeAccountModal();
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
}

// ✅ Firebase Logout Function
function logout() {
  signOut(auth)
    .then(() => {
      alert("✅ Logged out successfully!");
      closeAccountModal();
    })
    .catch((error) => {
      alert("❌ Logout failed: " + error.message);
    });
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
