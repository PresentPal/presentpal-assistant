import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Close Account Modal function
export function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none"; // Close modal
  }
}

// ✅ Ensure the function is globally available
window.closeAccountModal = closeAccountModal;

// ✅ Global Login Function
window.login = function() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // After login, fetch and store the Stripe customer ID
      fetchCustomerId(); 
      closeAccountModal();
    })
    .catch(error => alert("Login failed: " + error.message));
};

// ✅ Global Sign-Up Function
window.signUp = async function() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a Stripe customer for the new user
    const stripeCustomer = await createStripeCustomer(user.email);

    // Save user information and Stripe customer ID in Firestore
    await setDoc(doc(db, "users", user.uid), { 
      email: user.email, 
      subscription: "free", 
      stripeCustomerId: stripeCustomer.id 
    });

    alert("Account created successfully!");
    closeAccountModal();
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

// ✅ Global Logout Function
window.logout = function () {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    closeAccountModal();
    localStorage.removeItem("stripeCustomerId"); // Clear Stripe customer ID on logout
  });
};

// ✅ Monitor Auth State
onAuthStateChanged(auth, async (user) => {
  const dashboardButton = document.getElementById("dashboardButton");
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().subscription === "subscribedUser") {
      dashboardButton.style.display = "block";
    } else {
      dashboardButton.style.display = "none";
    }
    document.getElementById("logoutButton").style.display = "block";
  } else {
    dashboardButton.style.display = "none";
    document.getElementById("logoutButton").style.display = "none";
  }
});

// ✅ Fetch Customer ID from Firebase and store in localStorage
async function fetchCustomerId() {
  const user = auth.currentUser;
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.stripeCustomerId) {
          localStorage.setItem("stripeCustomerId", userData.stripeCustomerId);
          console.log("Stripe Customer ID stored:", userData.stripeCustomerId);
        } else {
          console.warn("No Stripe Customer ID found.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
}

// ✅ Function to create a Stripe customer
async function createStripeCustomer(email) {
  const response = await fetch("YOUR_BACKEND_ENDPOINT_TO_CREATE_STRIPE_CUSTOMER", {
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

// ✅ Toggle Password Visibility Function
export function togglePasswordVisibility(fieldId, iconId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(iconId);

    if (passwordField && toggleIcon) {
        if (passwordField.type === "password") {
            passwordField.type = "text"; // Show password
            toggleIcon.textContent = "👁️‍🗨️"; // Open eye icon
        } else {
            passwordField.type = "password"; // Hide password
            toggleIcon.textContent = "👁‍🗨"; // Closed eye icon
        }
    }
}

// ✅ Make sure it's globally available
window.togglePasswordVisibility = togglePasswordVisibility;
window.togglePasswordVisibility = togglePasswordVisibility;