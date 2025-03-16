const cors = require('cors');
const express = require('express');
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

dotenv.config();

console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

const app = express();

const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.use(cors({
    origin: 'https://www.presentpal.uk',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/verify-token', async (req, res) => {
  const idToken = req.body.token;

  if (!idToken) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    return res.status(200).json({ message: 'Token verified successfully!', uid });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token or token expired.' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post("/create-customer-portal", async (req, res) => {
    try {
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).send({ error: "Customer ID is required" });
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: "https://presentpal.uk/dashboard.html",
        });

        res.send({ url: session.url });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
