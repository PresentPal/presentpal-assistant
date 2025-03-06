onAuthStateChanged(auth, (user) => {
    const dashboardButton = document.getElementById("dashboardButton");
    const homeButton = document.getElementById("homeButton");
    const accountButton = document.getElementById("accountButton");
    const upgradeButton = document.getElementById("upgradeButton");

    console.log("User Status:", user);  // Log user object

    // Always show navigation bar
    document.querySelector(".nav-bar").style.display = "flex";

    // Always show Home, Account, and Upgrade buttons for all users
    homeButton.style.display = "block";
    accountButton.style.display = "block";
    upgradeButton.style.display = "block";

    if (user) {
        console.log("User is authenticated");
        checkSubscriptionStatus(user); // Check subscription

        // Show dashboard button for subscribed users
        dashboardButton.style.display = "block"; // Display dashboard for subscribers
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