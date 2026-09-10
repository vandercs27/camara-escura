const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    photographer: { type: String, required: true },
    year: { type: String, required: true },
    medium: { type: String, required: true },
    era: { type: String, required: true },
    historicalContext: { type: String, default: '' },
    photographerBio: { type: String, default: '' }, // Campo da minibiografia
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', photoSchema);