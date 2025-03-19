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
        console.warn("No user detected, hiding dashboard.");
        dashboardContainer.style.display = "none"; 
        return;
    }

    console.log("User detected:", user); // ✅ Log the user object

    dashboardContainer.style.display = "block";

    try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Fetched User Data:", userData); // ✅ Log fetched user data

            // Check if values exist before updating the UI
            document.getElementById("userName").innerText = userData.userName || "No Name Found";
            document.getElementById("userEmail").innerText = userData.email || "No Email Found";
            document.getElementById("subscriptionStatus").innerText = userData.package || "No Package Found";

            if (userData.customerId) {
                localStorage.setItem("customerId", userData.customerId);
                console.log("Stored customerId:", userData.customerId);
            }

            // Show dashboard button for subscribed users
            if (userData.subscription === "subscribedUser") {
                dashboardButton.style.display = "block"; 
            } else {
                dashboardButton.style.display = "none";
            }
        } else {
            console.warn("User document does not exist in Firestore.");
            alert("No user data found in Firestore.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading user data.");
    }
};

  // Listen for authentication state changes
 onAuthStateChanged(auth, (user) => {
    if (user) {
        updateDashboardUI(user);
    } else {
        console.warn("No user detected in auth state.");
    }
});

// Ensure UI updates if the user is already signed in
if (auth.currentUser) {
    updateDashboardUI(auth.currentUser);
}

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
