const fs = require('fs');
const path = require('path');

// Create a simple PNG using data URL (1x1 pixel, will be scaled)
const createPlaceholderPNG = (width, height, color, filename) => {
  // Create a minimal valid PNG file (1x1 pixel)
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xD7, 0x63, 0x60, 0x60, 0x60, 0x00,
    0x00, 0x00, 0x04, 0x00, 0x01, 0x27, 0x6B, 0xBE,
    0xBF, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
    0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(path.join(__dirname, 'assets', filename), png);
  console.log(`Created ${filename}`);
};

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create placeholder images
createPlaceholderPNG(1024, 1024, '#0A192F', 'icon.png');
createPlaceholderPNG(1024, 1024, '#0A192F', 'splash.png');
createPlaceholderPNG(1024, 1024, '#0A192F', 'adaptive-icon.png');
createPlaceholderPNG(48, 48, '#0A192F', 'favicon.png');

console.log('All asset placeholders created successfully!');
