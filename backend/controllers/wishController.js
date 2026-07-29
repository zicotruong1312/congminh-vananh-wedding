const WishModel = require('../models/WishModel');

const submitWish = async (req, res) => {
  try {
    const { guestName, message } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!guestName || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }

    // Rate Limiting: Max 4 wishes per guestName
    const wishCount = await WishModel.countDocuments({ guestName: new RegExp(`^${guestName}$`, 'i') });
    if (wishCount >= 4) {
      return res.status(429).json({ success: false, message: 'Bạn đã gửi tối đa số lời chúc cho phép. Cảm ơn bạn rất nhiều!' });
    }

    const newWish = new WishModel({
      guestName,
      message,
      ipAddress
    });

    await newWish.save();
    res.status(201).json({ success: true, message: 'Wish saved successfully' });
  } catch (error) {
    console.error('Wish Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving wish' });
  }
};

const getWishes = async (req, res) => {
  try {
    const wishes = await WishModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: wishes });
  } catch (error) {
    console.error('Fetch Wishes Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching wishes' });
  }
};

module.exports = {
  submitWish,
  getWishes
};
