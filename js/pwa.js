// ✅ Detect iOS Devices for PWA Instructions
function detectiOS() {
  const userAgent = window.navigator.userAgent;
  const iosInstructions = document.getElementById('iosInstructions');
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    if (iosInstructions) {
      iosInstructions.style.display = 'block'; // Show iOS install instructions
    }
  }
}

detectiOS(); // Call the function to check iOS

// Handle PWA installation prompts
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const iosInstructions = document.getElementById('iosInstructions');

// Show install prompt when it's available
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show the "Add to Home Screen" instructions if needed
  if (installPrompt) {
    installPrompt.style.display = 'block';
  }
});

// Show install button click event
installButton?.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      deferredPrompt = null;
      if (choiceResult.outcome === 'accepted') {
        console.log('User added to home screen');
      } else {
        console.log('User dismissed the prompt');
      }
    });
  }
});

// Check if PWA is already installed
function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Hide install prompt if PWA is already installed
function checkInstallationStatus() {
  if (isPWAInstalled() && iosInstructions) {
    iosInstructions.style.display = 'none'; // Hide iOS instructions if installed
  }
}

// Run the installation check on page load
checkInstallationStatus();