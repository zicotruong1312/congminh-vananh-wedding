const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Set up routes for gallery management
router.post('/upload', galleryController.uploadImage);
router.delete('/:filename', galleryController.deleteImage);

module.exports = router;
