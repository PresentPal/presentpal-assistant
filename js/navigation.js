import { auth } from './firebase.js';  // Import auth from firebase.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// ✅ Check User Subscription Status
function checkSubscriptionStatus(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.subscription === "subscribedUser") { 
                document.getElementById("dashboardButton").style.display = "block"; // Show dashboard for paid users
            } else {
                document.getElementById("dashboardButton").style.display = "none"; // Hide it for free users
            }
        }
    });
}

// ✅ onAuthStateChanged for Navigation Button Updates
onAuthStateChanged(auth, (user) => {
  const dashboardButton = document.getElementById("dashboardButton");
  const homeButton = document.getElementById("homeButton");
  const accountButton = document.getElementById("accountButton");
  const upgradeButton = document.getElementById("upgradeButton");

  console.log("User Status:", user);  // Log the user status to check if it's working

  if (user) {
      checkSubscriptionStatus(user); // Check subscription

      // Always show navigation bar for logged-in users
      document.querySelector(".nav-bar").style.display = "flex";

      // Show the buttons when the user is logged in
      accountButton.style.display = "block";
      upgradeButton.style.display = "block";
      dashboardButton.style.display = "block"; // Display dashboard for subscribers

      document.getElementById("loginForm").style.display = "none";
      document.getElementById("signupForm").style.display = "none";
  } else {
      // Hide buttons when logged out
      dashboardButton.style.display = "none";
      accountButton.style.display = "none";
      upgradeButton.style.display = "none";

      // Always show navigation bar even for free users
      const navBar = document.querySelector(".nav-bar");
      if (navBar) {
          navBar.style.display = "flex"; // Ensure the navbar is visible
      }

      document.getElementById("loginForm").style.display = "block";
      document.getElementById("signupForm").style.display = "none";
  }

  // ✅ Event Listener for Dashboard Button
  if (dashboardButton) {
    dashboardButton.addEventListener("click", () => {
      window.location.href = "dashboard.html"; // Redirect to the dashboard page
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