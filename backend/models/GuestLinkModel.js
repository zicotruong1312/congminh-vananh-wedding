const mongoose = require('mongoose');

const guestLinkSchema = new mongoose.Schema({
    guestName: { type: String, required: true, trim: true },
    link: { type: String, required: true },
    createdBy: { type: String, required: true }, // 'Công Minh' or 'Vân Anh'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuestLink', guestLinkSchema);
