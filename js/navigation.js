// ✅ Import Firebase and Firestore functions
import { auth, db } from './firebase.js';  
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
    }).catch((error) => {
        console.error("Error fetching subscription status:", error);
    });
}

// ✅ Function to Attach Event Listeners Once
function setupNavButtonListeners() {
    const dashboardButton = document.getElementById("dashboardButton");
    const homeButton = document.getElementById("homeButton");
    const accountButton = document.getElementById("accountButton");
    const upgradeButton = document.getElementById("upgradeButton");

    if (dashboardButton) {
        dashboardButton.onclick = () => window.location.href = "dashboard.html";
    }

    if (homeButton) {
        homeButton.onclick = () => window.location.href = "https://presentpal.uk";
    }

    if (accountButton) {
        accountButton.onclick = () => {
            const modal = document.getElementById("accountModal");
            if (modal) modal.style.display = "block";
        };
    }

    if (upgradeButton) {
        upgradeButton.onclick = () => window.location.href = "subscription-plans.html";
    }
}

// ✅ Ensure Firebase Auth is checked after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    setupNavButtonListeners(); // Attach event listeners once

    onAuthStateChanged(auth, (user) => {
        const dashboardButton = document.getElementById("dashboardButton");

        // Always show navigation bar
        document.querySelector(".nav-bar").style.display = "flex";

        // Always show Home, Account, and Upgrade buttons for all users
        document.getElementById("homeButton").style.display = "block";
        document.getElementById("accountButton").style.display = "block";
        document.getElementById("upgradeButton").style.display = "block";

        if (user) {
            console.log("User is authenticated:", user);
            checkSubscriptionStatus(user);
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("signupForm").style.display = "none";
        } else {
            console.log("User is not authenticated");
            dashboardButton.style.display = "none";
            document.getElementById("loginForm").style.display = "block";
            document.getElementById("signupForm").style.display = "none";
        }
    });
});
});