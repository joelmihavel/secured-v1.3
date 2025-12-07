const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/team-photos');
const OUTPUT_DIR = path.join(__dirname, '../public/team-photos-normalized');
const TARGET_WIDTH = 400;
const TARGET_HEIGHT = 500; // 4:5 aspect ratio

async function normalizeImages() {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Get all webp files
    const files = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.webp'));

    console.log(`Found ${files.length} images to process...`);

    for (const file of files) {
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        try {
            const metadata = await sharp(inputPath).metadata();

            // Calculate crop dimensions to maintain aspect ratio
            const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
            const currentRatio = metadata.width / metadata.height;

            let cropWidth = metadata.width;
            let cropHeight = metadata.height;
            let left = 0;
            let top = 0;

            if (currentRatio > targetRatio) {
                // Image is wider than target, crop width
                cropWidth = Math.round(metadata.height * targetRatio);
                left = Math.round((metadata.width - cropWidth) / 2);
            } else {
                // Image is taller than target, crop height from bottom (keep top for headshots)
                cropHeight = Math.round(metadata.width / targetRatio);
                top = 0; // Start from top to preserve heads
            }

            await sharp(inputPath)
                .extract({ left, top, width: cropWidth, height: cropHeight })
                .resize(TARGET_WIDTH, TARGET_HEIGHT, {
                    fit: 'cover',
                    position: 'top'
                })
                .webp({ quality: 90 })
                .toFile(outputPath);

            console.log(`✓ Processed ${file}`);
        } catch (error) {
            console.error(`✗ Error processing ${file}:`, error.message);
        }
    }

    console.log('\nAll images processed successfully!');
    console.log(`Normalized images saved to: ${OUTPUT_DIR}`);
}

normalizeImages();
