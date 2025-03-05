document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dashboardButton")?.addEventListener("click", () => window.location.href = "dashboard.html");
  document.getElementById("homeButton")?.addEventListener("click", () => window.location.href = "https://presentpal.uk");
  document.getElementById("accountButton")?.addEventListener("click", () => document.getElementById("accountModal").style.display = "block");
  document.getElementById("upgradeButton")?.addEventListener("click", () => window.location.href = "subscription-plans.html");
  document.querySelector(".close")?.addEventListener("click", () => document.getElementById("accountModal").style.display = "none");
});