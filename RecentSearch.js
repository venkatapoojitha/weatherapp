const mongoose = require('mongoose');

const recentSearchSchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const RecentSearch = mongoose.model('RecentSearch', recentSearchSchema);

module.exports = RecentSearch;
