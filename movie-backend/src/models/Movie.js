const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Movie', 'TV Show'], required: true },
  director: { type: String },
  budget: { type: Number },
  location: { type: String },
  duration: { type: String }, // e.g., "2h 10m" or "45m"
  yearOrTime: { type: String }, // can store year or show time
  details: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
