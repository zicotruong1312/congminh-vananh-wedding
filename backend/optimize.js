const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(__dirname, 'raw_images');
const thumbDir = path.join(__dirname, 'thumbnails');

async function optimize() {
    const files = fs.readdirSync(rawDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png'));
    console.log(`Found ${files.length} images to optimize.`);
    
    for (const file of files) {
        console.log(`Processing: ${file}`);
        const rawPath = path.join(rawDir, file);
        const thumbPath = path.join(thumbDir, file);
        
        // Read the file into buffer so we can overwrite it
        const buffer = fs.readFileSync(rawPath);
        
        // Optimize raw image (max 1920px width for lightbox/hero)
        await sharp(buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .jpeg({ quality: 75, progressive: true })
            .toFile(rawPath);
            
        // Optimize thumbnail (max 600px width for masonry gallery)
        await sharp(buffer)
            .resize({ width: 600, withoutEnlargement: true })
            .jpeg({ quality: 65, progressive: true })
            .toFile(thumbPath);
    }
    console.log('Optimization complete!');
}

optimize().catch(console.error);
