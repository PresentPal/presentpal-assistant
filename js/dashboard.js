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
        dashboardContainer.style.display = "none"; // Hide dashboard if no user is logged in
        return;
    }

    // Show the dashboard container since the user is logged in
    dashboardContainer.style.display = "block";

    try {
        // Fetch user data from Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Fetched User Data:", userData); // Debugging log

            // Update the UI elements with the correct Firestore data
            document.getElementById("userName").innerText = userData.userName || "User Name";
            document.getElementById("userEmail").innerText = userData.email || "Email not found";
            document.getElementById("subscriptionStatus").innerText = userData.package || "No Package Found";

            // Store customerId in local storage if it exists
            if (userData.customerId) {
                localStorage.setItem("customerId", userData.customerId);
            }

            // Update dashboard button visibility based on subscription
            if (userData.subscription === "subscribedUser") {
                dashboardButton.style.display = "block"; // Show dashboard button if the user is subscribed
            } else {
                dashboardButton.style.display = "none"; // Hide it for free users
            }
        } else {
            console.warn("User data not found in Firestore.");
            alert("No user data found.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data. Please try again later.");
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
