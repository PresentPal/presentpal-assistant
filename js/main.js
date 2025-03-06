import "./firebase.js";
import "./auth.js";
import "./subscriptions.js";
import "./navigation.js";
import "./pwa.js";

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Close Account Modal function
export function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none"; // Close modal
  }
}

// ✅ Ensure the function is globally available
window.closeAccountModal = closeAccountModal;

// ✅ Event listener for the close button inside the modal
document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.querySelector(".close");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeAccountModal(); // Close modal when the close button is clicked
    });
  }

  // ✅ Event listener to close modal when clicking outside the modal
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("accountModal");
    if (modal && event.target === modal) {
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