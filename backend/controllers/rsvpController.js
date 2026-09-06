const db = require('../db');

const checkRsvp = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json({ success: false, hasRsvp: false });

    const result = await db.query(
      `SELECT id as "_id", guest_name as "guestName", is_attending as "isAttending",
              guest_count as "guestCount", absence_reason as "absenceReason", created_at as "createdAt"
       FROM rsvps WHERE guest_name = $1 LIMIT 1`,
      [name]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, hasRsvp: true, data: result.rows[0] });
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
    const existing = await db.query(
      'SELECT id FROM rsvps WHERE guest_name = $1 LIMIT 1',
      [guestName]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Bạn đã gửi xác nhận tham dự trước đó rồi.' });
    }

    await db.query(
      `INSERT INTO rsvps (guest_name, is_attending, guest_count, absence_reason)
       VALUES ($1, $2, $3, $4)`,
      [guestName, isAttending, guestCount || 1, isAttending ? '' : (absenceReason || '')]
    );

    res.status(201).json({ success: true, message: 'RSVP saved successfully' });
  } catch (error) {
    console.error('RSVP Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving RSVP' });
  }
};

module.exports = { submitRsvp, checkRsvp };
