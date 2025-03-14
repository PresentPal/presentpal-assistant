import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
  const dashboardContainer = document.querySelector(".dashboard-container");
  const dashboardButton = document.getElementById("dashboardButton");

  // Function to update the dashboard container
  const updateDashboardUI = (user) => {
    if (!user) {
      dashboardContainer.style.display = "none"; // Hide the dashboard if the user is not logged in
      return;
    }

    // If the user is logged in, show the dashboard container
    dashboardContainer.style.display = "block"; 

    // Fetch user data from Firestore
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById("userName").innerText = userData.name || "User Name";
        document.getElementById("userEmail").innerText = userData.email;
        document.getElementById("subscriptionStatus").innerText = userData.subscription || "Loading...";

        // Update the dashboard button visibility based on subscription
        if (userData.subscription === "subscribedUser") {
          dashboardButton.style.display = "block"; // Show dashboard button if the user is subscribed
        } else {
          dashboardButton.style.display = "none"; // Hide the dashboard button if not subscribed
        }
      } else {
        console.log("User data not found in Firestore.");
      }
    }).catch((error) => {
      console.error("Error fetching user data:", error);
    });
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
});
