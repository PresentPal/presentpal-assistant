import "./firebase.js";
import "./auth.js";
import "./subscriptions.js";
import "./navigation.js";
import "./pwa.js";

// ✅ Close Account Modal function
export function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.style.display = "none"; // Close modal
  }
}

// ✅ Ensure the function is globally available
window.closeAccountModal = closeAccountModal;

// ✅ Run after DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.querySelector(".close");
  const modal = document.getElementById("accountModal");

  // ✅ Event listener for close button inside the modal
  if (closeButton) {
    closeButton.addEventListener("click", closeAccountModal);
  }

  // ✅ Event listener to close modal when clicking outside the modal
  window.addEventListener("click", (event) => {
    if (modal && event.target === modal) {
      closeAccountModal();
    }
  });
});