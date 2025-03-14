import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", async () => {
  const dashboardContainer = document.querySelector(".dashboard-container");
  const dashboardButton = document.getElementById("dashboardButton");

  // Function to update the dashboard container
  const updateDashboardUI = async (user) => {
    if (!user) {
      dashboardContainer.style.display = "none"; // Hide the dashboard if the user is not logged in
      return;
    }

    // Show the dashboard container if the user is logged in
    dashboardContainer.style.display = "block";

    try {
      // Check if customerId is stored in local storage
      let customerId = localStorage.getItem("customerId");

      if (!customerId) {
        // Fetch from Firestore if not found in local storage
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("userName").innerText = userData.name || "User Name";
          document.getElementById("userEmail").innerText = userData.email;
          document.getElementById("subscriptionStatus").innerText = userData.subscription || "Loading...";

          // Store customerId in local storage if it exists
          if (userData.customerId) {
            customerId = userData.customerId;
            localStorage.setItem("customerId", customerId);
          }

          // Update the dashboard button visibility based on subscription
          if (userData.subscription === "subscribedUser") {
            dashboardButton.style.display = "block"; // Show dashboard button if the user is subscribed
          } else {
            dashboardButton.style.display = "none"; // Hide the dashboard button if not subscribed
          }
        } else {
          console.warn("User data not found in Firestore.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    updateDashboardUI(user); // Call the function to update UI based on authentication state

    // Event listener for the dashboard button
    if (dashboardButton) {
      dashboardButton.addEventListener("click", () => {
        window.location.href = "dashboard.html"; // Redirect to the dashboard page
      });
    }
  });

  // Initial check in case the user is already logged in before page load
  if (auth.currentUser) {
    updateDashboardUI(auth.currentUser);
  }
});
