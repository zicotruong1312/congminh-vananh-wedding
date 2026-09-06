const db = require('../db');

const submitWish = async (req, res) => {
  try {
    const { guestName, message } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!guestName || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }

    // Rate Limiting: Max 4 wishes per guestName
    const countResult = await db.query(
      'SELECT COUNT(*) FROM wishes WHERE LOWER(guest_name) = LOWER($1)',
      [guestName]
    );
    if (parseInt(countResult.rows[0].count) >= 4) {
      return res.status(429).json({ success: false, message: 'Bạn đã gửi tối đa số lời chúc cho phép. Cảm ơn bạn rất nhiều!' });
    }

    await db.query(
      'INSERT INTO wishes (guest_name, message, ip_address) VALUES ($1, $2, $3)',
      [guestName, message, ipAddress]
    );

    res.status(201).json({ success: true, message: 'Wish saved successfully' });
  } catch (error) {
    console.error('Wish Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving wish' });
  }
};

const getWishes = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id as "_id", guest_name as "guestName", message, ip_address as "ipAddress", created_at as "createdAt"
       FROM wishes ORDER BY created_at DESC`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch Wishes Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching wishes' });
  }
};

module.exports = { submitWish, getWishes };
