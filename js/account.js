import { auth, db, storage } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getUserData, checkSubscriptionStatus } from "./navigation.js";  // Import the getter function
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";


// Apply theme class ASAP to avoid default yellow flash
try {
  const storedUserData = window.userData || JSON.parse(localStorage.getItem("User Data"));
  if (storedUserData && storedUserData.package) {
    const userPackage = storedUserData.package;
    document.body.classList.remove("plus-theme", "premium-theme");

    if (userPackage === "PresentPal+") {
      document.body.classList.add("plus-theme");
    } else if (userPackage === "PresentPal Premium") {
      document.body.classList.add("premium-theme");
    }
  }
} catch (e) {
  console.warn("No valid user data found for early theming.");
}

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

    const data = await response.json();
    if (response.ok) {
      console.log('Backend response:', data);
    } else {
      console.error('Error verifying token:', data.error);
    }
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
}

// ✅ Global Sign-Up Function (Creates Firebase user WITHOUT Stripe customer for free plan)
window.signUp = async function () {
  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill out all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Store user info in Firestore WITHOUT creating Stripe customer yet
    await setDoc(doc(db, "users", user.uid), {
      userName: name,
      email: user.email,
      subscription: "freeUser",
      customerId: null
    });

    showToast("Account created successfully!");
closeAccountModal();
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed: " + error.message);
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

// ✅ Monitor Auth State & Show Dashboard Button for Subscribed Users
// Inside auth.js

onAuthStateChanged(auth, async (user) => {
  const dashboardButton = document.getElementById("dashboardButton");

  if (user) {
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
    
    // Show the logout button when user is logged in (inside modal)
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.style.display = "block";
    }
  }
  }
});

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

// ✅ Update Dashboard UI with User Data
export function updateDashboardUI(userData) {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const userSubscriptionElement = document.getElementById("userSubscription");

    console.log("Updating dashboard UI with data: ", userData);

    if (userData) {
        // Set userName, email, and package
        if (userNameElement) {
            console.log("Setting userName to:", userData.userName);
            userNameElement.textContent = userData.userName || "No Name"; // Default to "No Name"
        }
        if (userEmailElement) {
            console.log("Setting userEmail to:", userData.email);
            userEmailElement.textContent = userData.email || "No Email"; // Default to "No Email"
        }
        if (userSubscriptionElement) {
            console.log("Setting userSubscription to:", userData.package);
            userSubscriptionElement.textContent = userData.package || "No subscription info"; // Default to "No subscription info"
        }
        
        // Apply theme to body based on package
document.body.classList.remove("plus-theme", "premium-theme"); // Clear any previous
if (userData.package === "PresentPal+") {
  document.body.classList.add("plus-theme");
} else if (userData.package === "PresentPal Premium") {
  document.body.classList.add("premium-theme");
}
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
window.showLoginForm = function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const step2 = document.getElementById("signupStep2");

  if (loginForm) loginForm.style.display = "block";
  if (signupForm) signupForm.style.display = "none";
  if (step2) step2.style.display = "none"; // optional: reset step 2
};

// ✅ Function to Show Signup Form
window.showSignUpForm = function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const step2 = document.getElementById("signupStep2");

  if (loginForm) loginForm.style.display = "none";
  if (signupForm) signupForm.style.display = "block";
  if (step2) step2.style.display = "none"; // optional: reset step 2
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

// ✅ Toast Notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.display = "none";
    }, 300); // Wait for fade-out transition
  }, 2500); // Show toast for 2.5 seconds
}

// Open Edit Profile Modal
window.openEditProfileModal = async function () {
  const modal = document.getElementById("editProfileModal");
  modal.style.display = "flex";

  const user = auth.currentUser;
  if (!user) return;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    document.getElementById("editUserName").value = data.userName || "";
    document.getElementById("editBio").value = data.bio || "";
  }
};

// Close Modal
window.closeEditProfileModal = function () {
  document.getElementById("editProfileModal").style.display = "none";
};

// Save Profile Changes
window.saveProfile = async function () {
  const name = document.getElementById("editUserName").value.trim();
  const bio = document.getElementById("editBio").value.trim().slice(0, 140);
  const file = document.getElementById("editProfilePic").files[0];
  const user = auth.currentUser;

  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const updates = { userName: name, bio };

    if (file) {
      const profilePicRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(profilePicRef, file);
      const downloadURL = await getDownloadURL(profilePicRef);
      updates.profilePicURL = downloadURL;
    }

    await updateDoc(userRef, updates);
    showToast("Profile updated!");
    closeEditProfileModal();
  } catch (err) {
    console.error("Profile update error:", err);
    alert("Failed to update profile.");
  }
};
