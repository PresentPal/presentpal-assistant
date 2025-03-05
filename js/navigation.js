// navigation.js
import { auth } from './firebase.js';  // Import auth from firebase.js

// ✅ Import Firebase Authentication functions
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

  if (user) {
      checkSubscriptionStatus(user); // Check subscription

      // Always show navigation bar for logged-in users
      document.getElementById("nav-bar").style.display = "flex";

      // Hide or show buttons based on user login
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
      const navBar = document.querySelector(".nav-bar"); // This selects the first element with the class "nav-bar"
      if (navBar) {
          navBar.style.display = "flex"; // Ensure the navbar is visible (just in case you need to set display)

          // Show login form for non-logged-in users
          document.getElementById("loginForm").style.display = "block";
          document.getElementById("signupForm").style.display = "none";
      } else {
          console.error("Navbar not found");
      }
  }

  // ✅ Event Listener for Dashboard Button
  document.getElementById("dashboardButton").addEventListener("click", () => {
    window.location.href = "dashboard.html"; // Redirect to the dashboard page
  });

  // ✅ Event Listener for Home Button
  document.getElementById("homeButton").addEventListener("click", () => {
    window.location.href = "https://presentpal.uk"; // Go to the home page
  });

  // ✅ Event Listener for Account Button
  document.getElementById("accountButton").addEventListener("click", () => {
    const modal = document.getElementById("accountModal");
    if (modal) modal.style.display = "block"; // Open account modal
  });

  // ✅ Event Listener for Upgrade Button
  document.getElementById("upgradeButton").addEventListener("click", () => {
    window.location.href = "subscription-plans.html"; // Go to the subscription page
  });
});