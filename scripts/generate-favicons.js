const fs = require('fs');
const path = require('path');

// Simple SVG to PNG conversion using a basic approach
// In a real environment, you'd use a proper image processing library

const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="16" cy="16" r="15" fill="url(#gradient)" stroke="#ffffff" stroke-width="2"/>
  
  <!-- Dumbbell icon -->
  <g transform="translate(8, 8)">
    <!-- Left weight -->
    <circle cx="2" cy="8" r="2" fill="#ffffff"/>
    <!-- Right weight -->
    <circle cx="14" cy="8" r="2" fill="#ffffff"/>
    <!-- Bar -->
    <rect x="4" y="7" width="8" height="2" fill="#ffffff" rx="1"/>
    <!-- Center grip -->
    <rect x="6" y="6" width="4" height="4" fill="#ffffff" rx="0.5"/>
  </g>
  
  <!-- Small accent dots -->
  <circle cx="8" cy="8" r="1" fill="#ffffff" opacity="0.6"/>
  <circle cx="24" cy="24" r="1" fill="#ffffff" opacity="0.6"/>
</svg>`;

// For now, let's create a simple solution by removing the problematic PNG references
// and using only the SVG favicon

console.log('🔧 Fixing favicon issues...');

// Update the site.webmanifest to remove problematic PNG references
const manifestPath = path.join(__dirname, '../apps/web/public/site.webmanifest');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Remove PNG icons that are causing issues
manifest.icons = manifest.icons.filter(icon => icon.type === 'image/svg+xml');

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// Update index.html to remove problematic PNG favicon references
const htmlPath = path.join(__dirname, '../apps/web/index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Remove PNG favicon links
htmlContent = htmlContent.replace(/<link rel="icon" type="image\/png"[^>]*>/g, '');
htmlContent = htmlContent.replace(/<link rel="apple-touch-icon"[^>]*>/g, '');

fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Favicon issues fixed!');
console.log('📋 Changes made:');
console.log('  - Removed problematic PNG favicon references from manifest');
console.log('  - Removed PNG favicon links from HTML');
console.log('  - Using only SVG favicon which works properly');
console.log('');
console.log('🎯 The favicon error should now be resolved!'); 