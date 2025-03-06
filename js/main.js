import "./firebase.js";
import "./auth.js";
import "./subscriptions.js";
import "./navigation.js";
import "./pwa.js";

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Close Account Modal function
  window.closeAccountModal = function () {
    const modal = document.getElementById("accountModal");
    if (modal) {
      modal.style.display = "none"; // Close modal
      console.log("Modal closed."); // Debugging log
    } else {
      console.log("Modal not found!"); // Debugging log
    }
  };

  // ✅ Event listener for the close button inside the modal
  document.getElementById("closeModal")?.addEventListener("click", () => {
    console.log("Close button clicked."); // Debugging log
    closeAccountModal();
  });

  // ✅ Event listener to close modal when clicking outside the modal
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("accountModal");
    if (event.target === modal) {
      console.log("Clicked outside modal."); // Debugging log
      closeAccountModal();
    }
  });
});

// ✅ Event listener for Account Button to open modal
document.getElementById("accountButton")?.addEventListener("click", function () {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "block"; // Show the modal
  }
});

// ✅ Toggle password visibility function
window.togglePasswordVisibility = function(fieldId, iconId) {
  const passwordField = document.getElementById(fieldId);  // Get the password field
  const toggleIcon = document.getElementById(iconId);      // Get the toggle icon

  if (passwordField && toggleIcon) {  // Ensure the password field and icon are found
    if (passwordField.type === "password") {
      passwordField.type = "text";   // Show password
      toggleIcon.textContent = "👁️‍🗨️";  // Open eye icon
    } else {
      passwordField.type = "password";  // Hide password
      toggleIcon.textContent = "👁‍🗨";  // Closed eye icon
    }
  } else {
    console.error('Password field or icon not found');
  }
}

export { 
  closeAccountModal, 
  addCloseButtonListener, 
  addOutsideClickListener, 
  addAccountButtonListener, 
  togglePasswordVisibility 
};