const stripe = Stripe("pk_live_51QxPo8L0iXZqwWyU2C3C2Uvro0Vqnyx1ConBqFZMRXP98UxTHKezDnvvFPurXS9KDWih5o0IAD7fGxhGs8UfYmge00isnX5Q5s");

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

// ✅ Handle Stripe Customer Portal
async function manageSubscription() {
    // Retrieve the customer ID (ensure it's stored correctly)
    const customerId = localStorage.getItem("stripeCustomerId");

    if (!customerId) {
        alert("Customer ID not found. Please ensure you are logged in.");
        return;
    }

    try {
        const response = await fetch("https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/create-customer-portal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId }),
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe Customer Portal
        } else {
            alert("Failed to retrieve the portal URL.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while opening the portal.");
    }
}

// ✅ Event Listeners for Subscription Buttons
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("selectPlus")?.addEventListener("click", () => redirectToCheckout("price_1QxRLML0iXZqwWyU8I15Elna"));
  document.getElementById("selectPremium")?.addEventListener("click", () => redirectToCheckout("price_1QxRTTL0iXZqwWyUNyWg3oPh"));

  // ✅ Add event listener for Manage Subscription button
  document.getElementById("manageSubscription")?.addEventListener("click", manageSubscription);
});
