const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // Load environment variables
const axios = require('axios');

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Schema for recent searches
const searchSchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Search = mongoose.model('Search', searchSchema);

// API endpoint to get recent searches
app.get('/api/recent-searches', async (req, res) => {
  try {
    const recentSearches = await Search.find().sort({ date: -1 }).limit(5);
    res.json({ searches: recentSearches });
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    res.status(500).json({ error: 'Failed to fetch recent searches' });
  }
});

// API endpoint to save a new search
app.post('/api/weather', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // Save the search to MongoDB
    const newSearch = new Search({ city });
    await newSearch.save();

    res.status(200).json({ message: 'Search saved successfully' });
  } catch (error) {
    console.error('Error saving search:', error);
    res.status(500).json({ error: 'Failed to save search' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
