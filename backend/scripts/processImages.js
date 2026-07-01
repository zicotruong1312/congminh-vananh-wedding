const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(__dirname, '..', 'raw_images');
const outputDir = path.join(__dirname, '..', '..', 'frontend', 'assets', 'album');
const jsonPath = path.join(outputDir, 'album-data.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
    if (!fs.existsSync(rawDir)) {
        console.error(`ERROR: Directory ${rawDir} does not exist.`);
        console.log("Please create a 'raw_images' folder in the backend directory and put your photos there.");
        return;
    }

    const files = fs.readdirSync(rawDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    if (files.length === 0) {
        console.log("No images found in raw_images directory.");
        return;
    }

    console.log(`Found ${files.length} images. Starting processing...`);
    const processedFiles = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const inputPath = path.join(rawDir, file);
        // Rename to a safe standard format like img-001.jpg
        const outputFilename = `img-${String(i + 1).padStart(3, '0')}.jpg`;
        const outputPath = path.join(outputDir, outputFilename);

        try {
            // Priority: Maximum quality and sharpness
            // Resize to 1920px (Full HD) instead of 1000px to ensure it looks perfectly sharp on 4K/retina screens when zoomed.
            await sharp(inputPath)
                .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
                .sharpen() // Adds a slight sharpening filter to counter any softness from resizing
                .jpeg({ quality: 95, progressive: true, mozjpeg: true }) // Near-lossless quality with advanced compression
                .toFile(outputPath);
            
            processedFiles.push(outputFilename);
            process.stdout.write(`\rProcessed ${i + 1}/${files.length} images...`);
        } catch (err) {
            console.error(`\nError processing ${file}:`, err.message);
        }
    }

    // Write JSON file for frontend
    fs.writeFileSync(jsonPath, JSON.stringify(processedFiles, null, 2));
    console.log(`\nSuccess! Processed ${processedFiles.length} images.`);
    console.log(`Output saved to: ${outputDir}`);
    console.log(`Data JSON saved to: ${jsonPath}`);
}

processImages();
