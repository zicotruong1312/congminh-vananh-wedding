const express = require('express');
const router = express.Router();
const wishController = require('../controllers/wishController');

router.post('/', wishController.submitWish);
router.get('/', wishController.getWishes);

module.exports = router;
