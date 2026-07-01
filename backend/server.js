require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
let sizeOf = require('image-size');
if (typeof sizeOf !== 'function') sizeOf = sizeOf.imageSize || sizeOf.default;
// Route imports
const rsvpRoutes = require('./routes/rsvpRoutes');
const wishRoutes = require('./routes/wishRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/wishes', wishRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve raw_images for gallery and thumbnails
app.use('/gallery', express.static(path.join(__dirname, 'raw_images')));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

// API to list gallery images with dimensions
app.get('/api/gallery', (req, res) => {
    const galleryPath = path.join(__dirname, 'raw_images');
    fs.readdir(galleryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Cannot read gallery images' });
        }
        // Only serve JPG/JPEG wedding photos - exclude all PNGs (baohy, qr, etc.)
        const imagesData = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg';
        }).map(file => {
            try {
                const buffer = fs.readFileSync(path.join(galleryPath, file));
                const dimensions = sizeOf(buffer);
                return {
                    name: file,
                    width: dimensions.width,
                    height: dimensions.height
                };
            } catch (e) {
                console.error(`sizeOf error for ${file}:`, e.message);
                // Fallback dimensions if reading fails
                return { name: file, width: 800, height: 1200 };
            }
        });
        res.json(imagesData);
    });
});

// Fallback for frontend SPA routing if needed (though it's a static site, good practice)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Database connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Start server regardless of DB connection (for serving static frontend)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
