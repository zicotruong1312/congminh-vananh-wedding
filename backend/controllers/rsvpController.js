const RsvpModel = require('../models/RsvpModel');

const checkRsvp = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json({ success: false, hasRsvp: false });
    
    const existing = await RsvpModel.findOne({ guestName: name });
    if (existing) {
      return res.json({ success: true, hasRsvp: true, data: existing });
    }
    return res.json({ success: true, hasRsvp: false });
  } catch (error) {
    console.error('Check RSVP Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const submitRsvp = async (req, res) => {
  try {
    const { guestName, isAttending, guestCount, absenceReason } = req.body;
    
    if (!guestName || typeof isAttending !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    // Check if already RSVP'd
    const existing = await RsvpModel.findOne({ guestName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Bạn đã gửi xác nhận tham dự trước đó rồi.' });
    }

    const newRsvp = new RsvpModel({
      guestName,
      isAttending,
      guestCount: guestCount || 1,
      absenceReason: isAttending ? '' : absenceReason
    });

    await newRsvp.save();
    res.status(201).json({ success: true, message: 'RSVP saved successfully' });
  } catch (error) {
    console.error('RSVP Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving RSVP' });
  }
};

module.exports = {
  submitRsvp,
  checkRsvp
};
