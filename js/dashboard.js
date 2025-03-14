import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Function to Fetch and Display User Info
async function fetchUserData(user) {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        document.getElementById("userName").textContent = userData.name || "User Name";
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("subscriptionStatus").textContent = userData.subscription || "Free Plan";
    }
}

// ✅ Handle Stripe Customer Portal Redirect
async function redirectToCustomerPortal() {
    try {
        const response = await fetch("https://your-heroku-app.herokuapp.com/create-customer-portal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: auth.currentUser?.uid })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert("Error retrieving portal URL.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to open customer portal.");
    }
}

// ✅ Listen for Auth Changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserData(user);
        document.getElementById("dashboardContainer").style.display = "block";
    } else {
        window.location.href = "index.html"; // Redirect if not logged in
    }
});

// ✅ Attach Event Listener to Manage Subscription Button
document.getElementById("manageSubscription")?.addEventListener("click", redirectToCustomerPortal);
