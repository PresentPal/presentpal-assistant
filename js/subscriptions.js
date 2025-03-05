const stripe = Stripe("pk_live_51QxPo8L0iXZqwWy...");

// ✅ Redirect to Stripe Checkout
function redirectToCheckout(priceId) {
  stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    successUrl: "https://presentpal.uk/success.html",
    cancelUrl: "https://presentpal.uk/subscription-plans.html"
  }).then(result => {
    if (result.error) alert(result.error.message);
  });
}

// ✅ Event Listeners for Subscription Buttons
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("selectPlus")?.addEventListener("click", () => redirectToCheckout("price_1QxRLML0iXZqwWyU8I15Elna"));
  document.getElementById("selectPremium")?.addEventListener("click", () => redirectToCheckout("price_1QxRTTL0iXZqwWyUNyWg3oPh"));
});