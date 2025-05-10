const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  wordIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }]
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
