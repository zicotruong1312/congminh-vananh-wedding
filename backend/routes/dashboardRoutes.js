const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboardData);
router.get('/validate/:guestName', dashboardController.validateGuest);
router.post('/link', dashboardController.saveGuestLink);
router.delete('/guest/:guestName', dashboardController.deleteGuest);

module.exports = router;
