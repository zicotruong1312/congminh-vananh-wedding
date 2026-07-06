const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, 'new_album');
const rawDir = path.join(__dirname, 'raw_images');
const thumbDir = path.join(__dirname, 'thumbnails');

async function optimize() {
    const files = fs.readdirSync(sourceDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png'));
    console.log(`Found ${files.length} images to optimize.`);
    
    // Process hero_bg if it exists in raw_images
    const heroPath = path.join(__dirname, '..', 'frontend', 'gallery', 'hero_bg.jpg'); // Wait, hero_bg.jpg is in raw_images, right? Let's just process sourceDir + manually process hero_bg
    
    for (const file of files) {
        console.log(`Processing: ${file}`);
        const srcPath = path.join(sourceDir, file);
        const rawPath = path.join(rawDir, file);
        const thumbPath = path.join(thumbDir, file);
        
        const buffer = fs.readFileSync(srcPath);
        
        // Optimize raw image (Full HD max 1920px width, 95% quality)
        await sharp(buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .jpeg({ quality: 95, progressive: true })
            .toFile(rawPath);
            
        // Optimize thumbnail (max 800px width for masonry gallery, 75% quality)
        await sharp(buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .jpeg({ quality: 75, progressive: true })
            .toFile(thumbPath);
    }
    
    // Don't forget hero_bg.jpg
    const heroSrc = path.join(__dirname, 'raw_images', 'hero_bg.jpg');
    if (fs.existsSync(heroSrc)) {
        const hBuffer = fs.readFileSync(heroSrc);
        await sharp(hBuffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .jpeg({ quality: 95, progressive: true })
            .toFile(heroSrc + '.tmp');
        fs.renameSync(heroSrc + '.tmp', heroSrc);
        console.log('Processed hero_bg.jpg');
    }
    
    console.log('Optimization complete!');
}

optimize().catch(console.error);
