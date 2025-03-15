const cors = require('cors'); // Import CORS
const express = require('express');
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

dotenv.config(); // Load environment variables

const app = express();

// ✅ Initialize Firebase Admin SDK
var admin = require("firebase-admin");

// Parse Firebase credentials from environment variable
var serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


// ✅ CORS Setup
app.use(cors({
    origin: 'https://www.presentpal.uk', // Allow requests from your website
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Ensure backend can handle JSON requests

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
