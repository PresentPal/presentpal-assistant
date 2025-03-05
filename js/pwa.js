// ✅ Detect iOS Devices for PWA Instructions
function detectiOS() {
  const userAgent = window.navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      document.getElementById('iosInstructions').style.display = 'block'; // Show iOS install instructions
  }
}

detectiOS(); // Call the function to check iOS

// Handle PWA installation prompts
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show the "Add to Home Screen" instructions if needed
});

document.getElementById('installButton').addEventListener('click', () => {
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

let deferredPrompt;
const iosInstructions = document.getElementById('iosInstructions');

function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function checkInstallationStatus() {
  if (isPWAInstalled()) {
    iosInstructions.style.display = 'none';
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installPrompt").style.display = "block";
});

document.getElementById("installPrompt")?.addEventListener("click", () => {
  deferredPrompt.prompt();
});