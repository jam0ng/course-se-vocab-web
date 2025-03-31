const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  english: { type: String, required: true },
  korean: { type: String, required: true },
  example: { type: String, required: true }
});

module.exports = mongoose.model('Word', WordSchema);
