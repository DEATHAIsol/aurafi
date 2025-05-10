const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  username: String,
  twitter: String,
  winRate: Number,
  avgReturn: Number,
  auraPoints: Number,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Fetch stats from Sol Tracker API
async function fetchSolTrackerStats(wallet) {
  try {
    const url = `https://data.solanatracker.io/pnl/${wallet}?showHistoricPnL=30&hideDetails=true`;
    console.log('Fetching Sol Tracker API:', url);
    const { data } = await axios.get(url, { headers: { 'x-api-key': process.env.SOLTRACKER_API_KEY } });
    console.log('Sol Tracker API response:', JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error('Error fetching from Sol Tracker API:', err.message);
    return null;
  }
}

// Calculate stats from Sol Tracker API response
async function calculateStatsFromSolTracker(wallet) {
  const trackerData = await fetchSolTrackerStats(wallet);
  if (!trackerData || typeof trackerData.summary !== 'object') return { winRate: 0, avgReturn: 0, auraPoints: 0, trades: [] };

  const summary = trackerData.summary;
  // Extract win rate as decimal
  const winRate = summary.winPercentage ? Number((summary.winPercentage / 100).toFixed(3)) : 0;
  // Extract avgReturn as realized / totalInvested, then add 1
  const avgReturn = (summary.realized && summary.totalInvested)
    ? Number((summary.realized / summary.totalInvested + 1).toFixed(3))
    : 0;
  // Aura points formula
  const auraPoints = Number((winRate * avgReturn * 1000).toFixed(2));

  return {
    winRate,
    avgReturn,
    auraPoints,
    trades: [] // trades not needed for this calculation
  };
}

// API endpoint
app.post('/api/submit-wallet', async (req, res) => {
  const { wallet, username, twitter } = req.body;
  console.log('Received wallet submission:', { wallet, username, twitter });
  const stats = await calculateStatsFromSolTracker(wallet);
  try {
    const user = await User.findOneAndUpdate(
      { wallet },
      {
        wallet,
        username,
        twitter,
        winRate: stats.winRate,
        avgReturn: stats.avgReturn,
        auraPoints: stats.auraPoints
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ ...user.toObject(), trades: stats.trades });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Leaderboard endpoint (optional, unchanged)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ auraPoints: -1 }).limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 