// ✅ Password Visibility Function
function togglePasswordVisibility(fieldId, iconId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(iconId);

    if (passwordField && toggleIcon) {
         console.log(`Toggling visibility for: ${fieldId}`); // Debugging line

        if (passwordField.type === "password") {
            passwordField.type = "text"; // Show password
            toggleIcon.textContent = "👁️‍🗨️"; // Open eye icon
        } else {
            passwordField.type = "password"; // Hide password
            toggleIcon.textContent = "👁‍🗨"; // Closed eye icon
        }
    } else {
        console.error('Password field or toggle icon not found!');
    }
}

// ✅ Make sure it's globally available
window.togglePasswordVisibility = togglePasswordVisibility;

import { auth, db } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Close Account Modal function
export function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none"; // Close modal
  }
}
window.closeAccountModal = closeAccountModal;

// ✅ Global Login Function
window.login = function() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      if (!user) {
        console.error("No user object returned from sign-in.");
        return;
      }

      try {
        // Fetch the Firebase ID Token
        const idToken = await user.getIdToken();
        // Send the ID token to the backend (for verification and further actions)
        sendTokenToBackend(idToken);  // This is where you only need to call it once
        // Fetch and store the Stripe customer ID
        await fetchCustomerId(user.uid);
        closeAccountModal();
      } catch (error) {
        console.error("Error getting ID token: ", error);
        alert("Failed to get ID token.");
      }
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    });
};

// Function to send the ID token to your backend
async function sendTokenToBackend(idToken) {
  try {
    const response = await fetch('https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}` // Send token as a Bearer token in the Authorization header
      },
      body: JSON.stringify({})
    });

// Log the response to check what is returned
    const textResponse = await response.text();
    console.log('Raw response:', textResponse); // Log the raw response before parsing it
    
   const data = JSON.parse(textResponse);
    if (response.ok) {
      console.log('Backend response:', data);
    } else {
      console.error('Error verifying token:', data.error);
    }
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
}

// ✅ Verify Signup
// ✅ Step 1: Send verification code
window.sendVerificationCode = async function () {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    return alert("Please fill out all fields.");
  }
  if (password !== confirmPassword) {
    return alert("Passwords do not match!");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem("verifyCode", code);
  localStorage.setItem("pendingSignup", JSON.stringify({ name, email, password }));

  try {
    const res = await fetch("https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const result = await res.json();
    if (!result.success) throw new Error("Verification failed");

    document.getElementById("signupForm").style.display = "none";
    document.getElementById("signupStep2").style.display = "block";
  } catch (err) {
    console.error("Verification error:", err);
    alert("Could not send verification email.");
  }
};

// ✅ Step 2: Confirm code & complete signup
window.completeSignupWithCode = async function () {
  const inputCode = document.getElementById("verificationCodeInput").value.trim();
  const expectedCode = localStorage.getItem("verifyCode");
  const signupData = JSON.parse(localStorage.getItem("pendingSignup") || "{}");

  if (!inputCode || inputCode !== expectedCode) {
    return alert("Incorrect or missing verification code.");
  }

  const { name, email, password } = signupData;
  if (!name || !email || !password) {
    return alert("Signup info missing. Start again.");
  }

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", user.uid), {
      userName: name,
      email,
      subscription: "freeUser",
      customerId: null
    });

    const stripeCustomer = await createStripeCustomer(email);
    await updateDoc(doc(db, "users", user.uid), {
      customerId: stripeCustomer.id
    });

    localStorage.removeItem("verifyCode");
    localStorage.removeItem("pendingSignup");
    alert("Account created!");
    closeAccountModal();
  } catch (err) {
    console.error("Signup error:", err);
    alert("Signup failed: " + err.message);
  }
};

// ✅ Global Logout Function
window.logout = function () {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    closeAccountModal();
    localStorage.removeItem("customerId"); // Clear customer ID from local storage
    window.location.href = "https://presentpal.uk"; // Redirect to homepage
  }).catch((error) => {
    console.error("Logout failed:", error);
  });
};

// ✅ Monitor Auth State & Show Dashboard Container for All Authenticated Users
onAuthStateChanged(auth, async (user) => {
  const dashboardContainer = document.querySelector('.dashboard-container');
  const dashboardButton = document.getElementById("dashboardButton");
  const logoutButton = document.getElementById("logoutButton");

  if (user) {
    // Make sure the dashboard container is visible
    if (dashboardContainer) {
      dashboardContainer.style.display = "block";
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Show the dashboard button only for subscribed users
      if (userData.subscription === "subscribedUser") {
        dashboardButton.style.display = "block";
      } else {
        dashboardButton.style.display = "none";
      }

      // Fetch and store customerId in localStorage
      if (userData.customerId) {
        localStorage.setItem("customerId", userData.customerId);
      }

      // Show the correct chatbot based on the user's subscription and package
      showChatbotBasedOnSubscription(userData.subscription, userData.package);
    }

    // Show the logout button when user is logged in (inside modal)
    if (logoutButton) {
      logoutButton.style.display = "block";
    }
  } else {
    // No user logged in, hide the dashboard container
    if (dashboardContainer) {
      dashboardContainer.style.display = "none";
    }

    // Hide logout button if no user is logged in
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
    
    // Show the free chatbot for unauthenticated users
    showChatbotBasedOnSubscription("freeUser", "free");
  }
});

// Function to show the correct chatbot based on the user's subscription and package
function showChatbotBasedOnSubscription(subscription, packageType) {
    const chatbotFree = document.getElementById("chatbotFree");
    const chatbotPlus = document.getElementById("chatbotPlus");
    const chatbotPremium = document.getElementById("chatbotPremium");

    // Hide all chatbots initially
    if (chatbotFree) chatbotFree.style.display = "none";
    if (chatbotPlus) chatbotPlus.style.display = "none";
    if (chatbotPremium) chatbotPremium.style.display = "none";

    let configUrl = "";

    // Determine which chatbot to show based on subscription type
    if (subscription === "freeUser") {
        if (chatbotFree) chatbotFree.style.display = "block";
        configUrl = "https://storage.googleapis.com/landbot.online/v3/H-2769762-VQ3B8OLEKLOSPJSC/index.json";
    } else if (subscription === "subscribedUser") {
        if (packageType === "PresentPal+") {
            if (chatbotPlus) chatbotPlus.style.display = "block";
            configUrl = "https://storage.googleapis.com/landbot.online/v3/H-2834423-29VBX8T7M9HF9JZQ/index.json";
        } else if (packageType === "PresentPal Premium") {
            if (chatbotPremium) chatbotPremium.style.display = "block";
            configUrl = "https://storage.googleapis.com/landbot.online/v3/H-2836767-VUKNK95YMC1683Y0/index.json";
        }
    }

    // Load Landbot chatbot dynamically
    if (configUrl) {
        const landbotContainer = document.getElementById("landbotContainer");
        if (landbotContainer) {
            landbotContainer.innerHTML = ""; // Clear old chatbot
            new Landbot.Container({
                container: "#landbotContainer",
                configUrl: configUrl,
            });
        }
    }
}

// ✅ Fetch Customer ID from Firebase and Store in Local Storage
async function fetchCustomerId(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.customerId) {
        localStorage.setItem("customerId", userData.customerId);
        console.log("Stripe Customer ID stored:", userData.customerId);
      } else {
        console.warn("No Stripe Customer ID found.");
      }
    }
  } catch (error) {
    console.error("Error fetching customerId:", error);
  }
}

// ✅ Function to Create a Stripe Customer (Updated API Call)
async function createStripeCustomer(email) {
  const response = await fetch("https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/create-stripe-customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.customer;
}

// ✅ Function to Show Login Form
window.showLoginForm = function() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
};

// ✅ Function to Show Signup Form
window.showSignUpForm = function() {
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
};

// ✅ Close Modal When Clicking Outside
document.addEventListener("click", (event) => {
  const modal = document.getElementById("accountModal");
  if (modal && event.target === modal) {
    closeAccountModal();
  }
});

// ✅ Event Listener for Close Button
document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.querySelector(".close");
  if (closeButton) {
    closeButton.addEventListener("click", closeAccountModal);
  }
});
