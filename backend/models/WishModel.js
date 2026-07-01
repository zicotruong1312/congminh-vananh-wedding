const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Wish', wishSchema);
