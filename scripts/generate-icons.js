const fs = require('fs');
const path = require('path');

// Simple PNG header for a 32x32 transparent image
const createSimplePNG = (width, height) => {
  // This is a minimal PNG file structure
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF, // width
    (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF, // height
    0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x00, 0x00, 0x00, 0x00, // CRC placeholder
    0x00, 0x00, 0x00, 0x00, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x00, 0x00, 0x00, 0x00, // CRC placeholder
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
  ]);
  return pngHeader;
};

// Generate icon files
const generateIcons = () => {
  const publicDir = path.join(__dirname, '../apps/web/public');
  
  const icons = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'logo-og.png', size: 1200 }
  ];

  icons.forEach(({ name, size }) => {
    const filePath = path.join(publicDir, name);
    const pngData = createSimplePNG(size, size);
    fs.writeFileSync(filePath, pngData);
    console.log(`✅ Generated ${name} (${size}x${size})`);
  });

  console.log('\n🎉 All icon files generated successfully!');
  console.log('Note: These are placeholder PNG files. For production, convert the SVG files to proper PNG images.');
};

generateIcons(); 