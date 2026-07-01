const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true,
  },
  isAttending: {
    type: Boolean,
    required: true,
  },
  guestCount: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
  },
  absenceReason: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Rsvp', rsvpSchema);
