import "./js/firebase.js";
import "./js/auth.js";
import "./js/subscriptions.js";
import "./js/navigation.js";
import "./js/pwa.js";

// ✅ Close Modal Function
window.closeAccountModal = function () {
  document.getElementById("accountModal").style.display = "none";
};

// ✅ Toggle Password Visibility
window.togglePasswordVisibility = function(fieldId) {
  const passwordField = document.getElementById(fieldId);
  passwordField.type = passwordField.type === "password" ? "text" : "password";
};