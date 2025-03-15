const cors = require('cors'); // Import CORS
const express = require('express');
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

dotenv.config(); // Load environment variables

// Log the Stripe secret key to check if it's loaded correctly
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ Initialize Firebase Admin SDK
const admin = require("firebase-admin");

// Parse Firebase credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// CORS Setup
app.use(cors({
    origin: 'https://www.presentpal.uk', // Allow requests from your website
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Verify Token Route
app.post('/verify-token', async (req, res) => {
  const idToken = req.body.token;

  if (!idToken) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Respond with the user's UID or other info
    return res.status(200).json({ message: 'Token verified successfully!', uid });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token or token expired.' });
  }
});

// Example test route to check if server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

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

// Set up the server to listen on a port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
