import "./firebase.js";
import "./auth.js";
import "./subscriptions.js";
import "./navigation.js";
import "./pwa.js";

// ✅ Close Account Modal function
window.closeAccountModal = function () {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none"; // Close modal
  }
};

// ✅ Event listener for the close button inside the modal
document.querySelector(".close")?.addEventListener("click", () => {
  closeAccountModal(); // Close modal when the close button is clicked
});

// ✅ Event listener to close modal when clicking outside the modal
window.onclick = function(event) {
  const modal = document.getElementById("accountModal");
  // Close modal if the user clicks outside of the modal content
  if (event.target === modal) {
    closeAccountModal();
  }
};

// ✅ Event listener for Account Button to open modal
document.getElementById("accountButton")?.addEventListener("click", function () {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "block"; // Show the modal
  }
});

// ✅ Toggle Password Visibility
window.togglePasswordVisibility = function(fieldId) {
  const passwordField = document.getElementById(fieldId);
  passwordField.type = passwordField.type === "password" ? "text" : "password";
};