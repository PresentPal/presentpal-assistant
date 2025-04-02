// ✅ Import Firebase Authentication functions
import { auth, db } from './firebase.js';  // Import auth and db from firebase.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"; // Correct import
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { updateDashboardUI } from './account.js';  // Correct import path


// Declare a global variable to store the userData
let userData = null;

// ✅ Check User Subscription Status
function checkSubscriptionStatus(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);  // Referencing the user document
    getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
            userData = docSnap.data();  // Store the fetched data
            console.log("User Data: ", userData); // Debugging log

            // Show the correct UI based on subscription status
            updateDashboardUI(userData); // Call to update the UI
        } else {
            console.log("User document does not exist");
        }
    }).catch((error) => {
        console.error("Error getting user data: ", error);
    });
}

// Function to show the login/signup modal
function showLoginModal() {
    const modal = document.getElementById("accountModal");
    if (modal) {
        modal.style.display = "flex"; // Open the account modal
    }
}

// ✅ Getter function to access userData
export function getUserData() {
  return userData;
}

export { checkSubscriptionStatus };

// ✅ onAuthStateChanged for Navigation Button Updates
onAuthStateChanged(auth, (user) => {
    const accountButton = document.getElementById("accountButton");
    const dashboardButton = document.getElementById("dashboardButton");
    const homeButton = document.getElementById("homeButton");
    const upgradeButton = document.getElementById("upgradeButton");

    // Initially hide the dashboard button until we verify the user's subscription
    dashboardButton.style.display = "none";

    // Always show navigation bar
    document.querySelector(".nav-bar").style.display = "flex";

    // Always show Home, Account, and Upgrade buttons for all users
    homeButton.style.display = "block";
    accountButton.style.display = "block";
    upgradeButton.style.display = "block";

    if (user) {
        console.log("User logged in, checking subscription status");
        checkSubscriptionStatus(user); // Check subscription

       // Ensure the script only modifies elements that exist
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (loginForm) loginForm.style.display = "none";
if (signupForm) signupForm.style.display = "none";

        // Change the 'account' button to redirect to 'account.html' for logged-in users
        accountButton.removeEventListener("click", showLoginModal); // Remove modal listener
        accountButton.addEventListener("click", () => {
            window.location.href = "account.html"; // Redirect to account page
        });
    } else {
        console.log("User is not authenticated");

        // Hide dashboard button when logged out
        dashboardButton.style.display = "none";

        // Show login form for non-logged-in users
      const loginFormEl = document.getElementById("loginForm");
      const signupFormEl = document.getElementById("signupForm");
      const signupStep2El = document.getElementById("signupStep2");

      if (loginFormEl) loginFormEl.style.display = "block";
      if (signupFormEl) signupFormEl.style.display = "none";
      if (signupStep2El) signupStep2El.style.display = "none";


        // Change the 'account' button to open the login/signup modal when not logged in
        accountButton.removeEventListener("click", showLoginModal); // Remove existing listener
        accountButton.addEventListener("click", showLoginModal); // Show modal when clicked
    }

    // ✅ Event Listener for Dashboard Button
    if (dashboardButton) {
        dashboardButton.addEventListener("click", () => {
            window.location.href = "dashboard.html"; // Redirect to the account page
        });
    }

    // ✅ Event Listener for Home Button
    if (homeButton) {
        homeButton.addEventListener("click", () => {
            window.location.href = "https://presentpal.uk"; // Go to the home page
        });
    }

   // ✅ Event Listener for Account Button
if (accountButton) {
    accountButton.addEventListener("click", () => {
        const user = auth.currentUser; // Get current user from Firebase

        // If user is authenticated, redirect to account.html
        if (user) {
            window.location.href = "account.html"; // Redirect to account page
        } else {
            // If not authenticated, show the login/signup modal
            showLoginModal(); // Open the account modal
        }
    });
}

    // ✅ Event Listener for Upgrade Button
    if (upgradeButton) {
        upgradeButton.addEventListener("click", () => {
            window.location.href = "subscription-plans.html"; // Go to the subscription page
        });
    }
});
