const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');

const rawImagesDir = path.join(__dirname, '..', 'raw_images');
const thumbnailsDir = path.join(__dirname, '..', 'thumbnails');

// Ensure directories exist
if (!fs.existsSync(rawImagesDir)) fs.mkdirSync(rawImagesDir, { recursive: true });
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true });

// Setup Multer Storage (store in memory first, then process with sharp)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('image');

const uploadImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        try {
            // Safe filename
            const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
            const baseName = path.basename(req.file.originalname, ext).replace(/[^a-z0-9]/gi, '_');
            let filename = `${baseName}-${Date.now()}.jpg`; // Force save as JPG for consistency

            const rawPath = path.join(rawImagesDir, filename);
            const thumbPath = path.join(thumbnailsDir, filename);

            // Process full image (save to raw_images)
            await sharp(req.file.buffer)
                .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 90, progressive: true })
                .toFile(rawPath);

            // Process thumbnail (save to thumbnails)
            await sharp(req.file.buffer)
                .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(thumbPath);

            res.status(201).json({ success: true, message: 'Image uploaded successfully', filename });
        } catch (error) {
            console.error('Image Upload Error:', error);
            res.status(500).json({ success: false, message: 'Server error processing image' });
        }
    });
};

const deleteImage = (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename) return res.status(400).json({ success: false, message: 'Filename required' });

        const rawPath = path.join(rawImagesDir, filename);
        const thumbPath = path.join(thumbnailsDir, filename);

        // Security check to avoid path traversal
        if (!rawPath.startsWith(rawImagesDir) || !thumbPath.startsWith(thumbnailsDir)) {
            return res.status(403).json({ success: false, message: 'Invalid filename' });
        }

        let deleted = false;
        if (fs.existsSync(rawPath)) {
            fs.unlinkSync(rawPath);
            deleted = true;
        }
        if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
            deleted = true;
        }

        if (deleted) {
            res.status(200).json({ success: true, message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete Image Error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting image' });
    }
};

module.exports = {
    uploadImage,
    deleteImage
};
