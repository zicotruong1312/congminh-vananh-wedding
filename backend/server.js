require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
let sizeOf = require('image-size');
if (typeof sizeOf !== 'function') sizeOf = sizeOf.imageSize || sizeOf.default;

// Database
const { testConnection, query } = require('./db');

// Route imports
const rsvpRoutes = require('./routes/rsvpRoutes');
const wishRoutes = require('./routes/wishRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/wishes', wishRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gallery', galleryRoutes);

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
            const isJpg = ext === '.jpg' || ext === '.jpeg';
            return isJpg && file !== 'hero_bg.jpg';
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
                return { name: file, width: 800, height: 1200 };
            }
        });
        res.json(imagesData);
    });
});

// Fallback for frontend SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Keepalive ping: Ping DB every 4 minutes to prevent Supabase free tier from pausing
const startKeepalive = () => {
  setInterval(async () => {
    try {
      await query('SELECT 1');
    } catch (err) {
      console.warn('⚠️ Keepalive ping failed:', err.message);
    }
  }, 4 * 60 * 1000); // every 4 minutes
};

// Start server after verifying DB connection
const startServer = async () => {
  try {
    await testConnection();
    startKeepalive();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database. Server not started.', err.message);
    process.exit(1);
  }
};

startServer();
