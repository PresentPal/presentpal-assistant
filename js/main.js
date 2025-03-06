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