const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(__dirname, 'raw_images');
const thumbDir = path.join(__dirname, 'thumbnails');

if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir);
}

const files = fs.readdirSync(rawDir).filter(f => f.match(/\.(jpg|jpeg)$/i));

async function processImages() {
    let count = 0;
    for (const file of files) {
        const rawPath = path.join(rawDir, file);
        const thumbPath = path.join(thumbDir, file);
        
        if (!fs.existsSync(thumbPath)) {
            try {
                await sharp(rawPath)
                    .resize({ width: 800, withoutEnlargement: true })
                    .jpeg({ quality: 80 })
                    .toFile(thumbPath);
                count++;
                if (count % 10 === 0) console.log(`Processed ${count} / ${files.length}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
    console.log(`Finished processing ${count} new thumbnails.`);
}

processImages();
