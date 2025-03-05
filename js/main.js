import "./firebase.js";
import "./auth.js";
import "./subscriptions.js";
import "./navigation.js";
import "./pwa.js";

// ✅ Close Modal Function
window.closeAccountModal = function () {
  document.getElementById("accountModal").style.display = "none";
};

// ✅ Toggle Password Visibility
window.togglePasswordVisibility = function(fieldId) {
  const passwordField = document.getElementById(fieldId);
  passwordField.type = passwordField.type === "password" ? "text" : "password";
};