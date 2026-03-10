const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Your service account JSON
const serviceAccount = require("./service-account.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://livescore-5dbe0.firebaseio.com"
});

const db = admin.database();

// API endpoint to get live match data
app.get('/match/:matchKey', async (req, res) => {
  const matchKey = req.params.matchKey;
  try {
    const snapshot = await db.ref(`matches/${matchKey}`).once('value');
    res.json(snapshot.val());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch match data", details: err });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
