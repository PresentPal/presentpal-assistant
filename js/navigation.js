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

// ✅ Getter function to access userData
export function getUserData() {
  return userData;
}

export { checkSubscriptionStatus };

// ✅ onAuthStateChanged for Navigation Button Updates
onAuthStateChanged(auth, (user) => {
  const dashboardButton = document.getElementById("dashboardButton");
  const homeButton = document.getElementById("homeButton");
  const accountButton = document.getElementById("accountButton");
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

      // Show dashboard button for subscribed users
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("signupForm").style.display = "none";
  } else {
      console.log("User is not authenticated");

      // Hide dashboard button when logged out
      dashboardButton.style.display = "none";

      // Show login form for non-logged-in users
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("signupForm").style.display = "none";
  }

  // ✅ Event Listener for Dashboard Button
  if (dashboardButton) {
    dashboardButton.addEventListener("click", () => {
        window.location.href = "account.html"; // Redirect to the dashboard page
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
        const modal = document.getElementById("accountModal");
        if (modal) modal.style.display = "block"; // Open account modal
    });
  }

  // ✅ Event Listener for Upgrade Button
  if (upgradeButton) {
    upgradeButton.addEventListener("click", () => {
        window.location.href = "subscription-plans.html"; // Go to the subscription page
    });
  }
});
