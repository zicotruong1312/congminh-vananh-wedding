const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpController');

router.post('/', rsvpController.submitRsvp);
router.get('/check', rsvpController.checkRsvp);

module.exports = router;
