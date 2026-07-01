const RsvpModel = require('../models/RsvpModel');
const WishModel = require('../models/WishModel');
const GuestLinkModel = require('../models/GuestLinkModel');

const getDashboardData = async (req, res) => {
  try {
    // Get all RSVPs
    const rsvps = await RsvpModel.find().sort({ createdAt: -1 });
    
    // Calculate total attending guests
    let totalAttendingGuests = 0;
    rsvps.forEach(rsvp => {
      if (rsvp.isAttending) {
        totalAttendingGuests += rsvp.guestCount;
      }
    });

    // Get all wishes
    const wishes = await WishModel.find().sort({ createdAt: -1 });

    // Get all guest links
    const guestLinks = await GuestLinkModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalAttendingGuests,
        rsvps,
        wishes,
        guestLinks
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard data' });
  }
};

const saveGuestLink = async (req, res) => {
  try {
    const { guestName, link, createdBy } = req.body;
    if (!guestName || !link) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    const creator = createdBy || 'Không rõ';

    // Check if link already exists for this guest - update it if so
    await GuestLinkModel.findOneAndUpdate(
      { guestName: { $regex: new RegExp('^' + guestName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } },
      { guestName, link, createdBy: creator, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save Guest Link Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const { guestName } = req.params;
    if (!guestName) {
      return res.status(400).json({ success: false, message: 'Thiếu tên khách mời' });
    }
    
    const query = { guestName: { $regex: new RegExp('^' + guestName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
    
    // Delete RSVP, Wishes AND the guest link record
    await RsvpModel.deleteMany(query);
    await WishModel.deleteMany(query);
    await GuestLinkModel.deleteMany(query);
    
    res.status(200).json({ success: true, message: 'Đã xóa toàn bộ dữ liệu khách mời thành công' });
  } catch (error) {
    console.error('Delete Guest Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const validateGuest = async (req, res) => {
  try {
    const { guestName } = req.params;
    if (!guestName) {
      return res.status(400).json({ valid: false });
    }
    const found = await GuestLinkModel.findOne({
      guestName: { $regex: new RegExp('^' + guestName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
    });
    res.status(200).json({ valid: !!found });
  } catch (error) {
    console.error('Validate Guest Error:', error);
    res.status(500).json({ valid: false });
  }
};

module.exports = {
  getDashboardData,
  saveGuestLink,
  deleteGuest,
  validateGuest
};
