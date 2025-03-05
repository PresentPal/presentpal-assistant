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