# Favicon and Logo Setup

This directory contains all the favicon and logo assets for the Fitness Tracker application.

## Current Files

### SVG Files (Ready to use)
- `favicon.svg` - Main favicon (32x32)
- `logo.svg` - Full logo with text and icon
- `logo-icon.svg` - Icon-only version of the logo

### PNG Files (Need to be generated)
The following PNG files need to be generated from the SVG files:

- `favicon-16x16.png` - Small favicon
- `favicon-32x32.png` - Standard favicon
- `apple-touch-icon.png` - Apple device icon (180x180)
- `android-chrome-192x192.png` - Android icon (192x192)
- `android-chrome-512x512.png` - Android icon (512x512)
- `logo-og.png` - Open Graph image (1200x630)

## How to Generate PNG Files

### Option 1: Online Converters
1. Go to https://convertio.co/svg-png/ or https://cloudconvert.com/svg-to-png
2. Upload the SVG file
3. Set the desired dimensions
4. Download the PNG file

### Option 2: Command Line (ImageMagick)
```bash
# Install ImageMagick first
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 android-chrome-192x192.png
convert favicon.svg -resize 512x512 android-chrome-512x512.png
convert logo.svg -resize 1200x630 logo-og.png
```

### Option 3: Node.js Script
```javascript
const sharp = require('sharp');

async function convertSvgToPng() {
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    await sharp('favicon.svg')
      .resize(size, size)
      .png()
      .toFile(name);
  }

  // Generate Open Graph image
  await sharp('logo.svg')
    .resize(1200, 630)
    .png()
    .toFile('logo-og.png');
}

convertSvgToPng();
```

## Logo Component Usage

The `Logo` component is available in the UI package and can be used throughout the application:

```tsx
import { Logo } from '@fitness-tracker/ui';

// Different variants
<Logo variant="full" size="lg" /> // Full logo with text
<Logo variant="icon" size="md" /> // Icon only
<Logo variant="text" size="sm" showTagline /> // Text with icon and tagline
```

### Logo Variants
- `full` - Complete logo with icon and text
- `icon` - Icon only
- `text` - Icon with text (customizable)

### Logo Sizes
- `sm` - Small (24px height)
- `md` - Medium (32px height)
- `lg` - Large (48px height)
- `xl` - Extra large (64px height)

## Browser Support

The favicon setup supports:
- Modern browsers (SVG favicon)
- Legacy browsers (PNG fallbacks)
- Apple devices (apple-touch-icon)
- Android devices (android-chrome icons)
- PWA support (web manifest)

## Testing

After generating the PNG files, test the favicons:
1. Clear browser cache
2. Visit the application
3. Check browser tab for favicon
4. Test on mobile devices
5. Test social media sharing (Open Graph image) 