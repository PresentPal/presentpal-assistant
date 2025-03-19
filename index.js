import "./js/auth.js";          // Handles login, signup, and logout
import "./js/firebase.js";      // Handles Firestore data
import "./js/navigation.js";    // Handles navigation and UI updates
import "./js/subscriptions.js"; // Handles Stripe payments
import "./js/pwa.js";           // Handles Progressive Web App features
import "./js/dashboard.js"; 

// In index.js
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

// Initialize Firebase Auth
const auth = getAuth();

// Export auth for other files to use
export { auth };

// Function to show the correct chatbot based on the user's subscription and package
function showChatbotBasedOnSubscription(subscription, packageType) {
    // Get the containers for each chatbot
    const chatbotFree = document.getElementById("chatbotFree");
    const chatbotPlus = document.getElementById("chatbotPlus");
    const chatbotPremium = document.getElementById("chatbotPremium");

    // Hide all chatbots initially
    chatbotFree.style.display = "none";
    chatbotPlus.style.display = "none";
    chatbotPremium.style.display = "none";

    // Logic to show the correct chatbot based on subscription and package
    if (subscription === "freeUser") {
        // For free users, show PresentPal chatbot
        chatbotFree.style.display = "block";
    } else if (subscription === "subscribedUser") {
        // For subscribed users, check the package
        if (packageType === "PresentPal+") {
            chatbotPlus.style.display = "block";
        } else if (packageType === "PresentPal Premium") {
            chatbotPremium.style.display = "block";
        }
    }
}
