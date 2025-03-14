
// Load environment variables
require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

// ✅ Route to Create a Stripe Customer Portal Session
app.post("/create-customer-portal", async (req, res) => {
    try {
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).send({ error: "Customer ID is required" });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: "https://presentpal.uk/dashboard.html", // Change this to your actual return URL
        });

        res.send({ url: session.url });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Simple route for testing
app.get("/", (req, res) => {
res.send("Hello, the server is running!");
});
