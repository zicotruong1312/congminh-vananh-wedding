const db = require('../db');

const getDashboardData = async (req, res) => {
  try {
    // Total attending guests count
    const totalResult = await db.query(
      `SELECT COALESCE(SUM(guest_count), 0) as total FROM rsvps WHERE is_attending = true`
    );
    const totalAttendingGuests = parseInt(totalResult.rows[0].total) || 0;

    // All RSVPs
    const rsvpsResult = await db.query(
      `SELECT id as "_id", guest_name as "guestName", is_attending as "isAttending",
              guest_count as "guestCount", absence_reason as "absenceReason", created_at as "createdAt"
       FROM rsvps ORDER BY created_at DESC`
    );

    // All wishes
    const wishesResult = await db.query(
      `SELECT id as "_id", guest_name as "guestName", message, ip_address as "ipAddress", created_at as "createdAt"
       FROM wishes ORDER BY created_at DESC`
    );

    // All guest links
    const linksResult = await db.query(
      `SELECT id as "_id", guest_name as "guestName", link, created_by as "createdBy", created_at as "createdAt"
       FROM guest_links ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: {
        totalAttendingGuests,
        rsvps: rsvpsResult.rows,
        wishes: wishesResult.rows,
        guestLinks: linksResult.rows
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

    // Upsert: insert or update on conflict (guest_name is UNIQUE)
    await db.query(
      `INSERT INTO guest_links (guest_name, link, created_by, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (guest_name)
       DO UPDATE SET link = $2, created_by = $3, created_at = NOW()`,
      [guestName, link, creator]
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

    const normalizedName = decodeURIComponent(guestName);

    // Delete from all 3 tables (case-insensitive match)
    await db.query('DELETE FROM rsvps WHERE LOWER(guest_name) = LOWER($1)', [normalizedName]);
    await db.query('DELETE FROM wishes WHERE LOWER(guest_name) = LOWER($1)', [normalizedName]);
    await db.query('DELETE FROM guest_links WHERE LOWER(guest_name) = LOWER($1)', [normalizedName]);

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
      return res.status(200).json({ valid: false });
    }

    const result = await db.query(
      'SELECT id FROM guest_links WHERE LOWER(guest_name) = LOWER($1) LIMIT 1',
      [decodeURIComponent(guestName)]
    );

    res.status(200).json({ valid: result.rows.length > 0 });
  } catch (error) {
    console.error('Validate Guest Error:', error);
    res.status(500).json({ valid: false });
  }
};

const deleteWish = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Thiếu ID lời chúc' });
    }

    await db.query('DELETE FROM wishes WHERE id = $1', [id]);

    res.status(200).json({ success: true, message: 'Đã xóa lời chúc thành công' });
  } catch (error) {
    console.error('Delete Wish Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa lời chúc' });
  }
};

module.exports = {
  getDashboardData,
  saveGuestLink,
  deleteGuest,
  validateGuest,
  deleteWish
};
