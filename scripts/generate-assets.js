const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Phazur Labs brand color
const PRIMARY_COLOR = '#7c3aed'; // Purple from theme
const SECONDARY_COLOR = '#0056D2'; // Coursera blue from design system

// Create SVG for the logo/icon
function createLogoSVG(size, bgColor = PRIMARY_COLOR) {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.15}"/>
      <text
        x="50%"
        y="55%"
        font-family="Arial, sans-serif"
        font-size="${size * 0.5}"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
      >P</text>
    </svg>
  `;
}

// Create SVG for default course image
function createCoursePlaceholderSVG(width, height) {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${SECONDARY_COLOR};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <circle cx="${width/2}" cy="${height/2 - 20}" r="40" fill="rgba(255,255,255,0.2)"/>
      <polygon points="${width/2 - 15},${height/2 - 35} ${width/2 + 25},${height/2 - 20} ${width/2 - 15},${height/2 - 5}" fill="white"/>
      <text
        x="50%"
        y="${height/2 + 50}"
        font-family="Arial, sans-serif"
        font-size="18"
        fill="rgba(255,255,255,0.9)"
        text-anchor="middle"
      >Phazur Labs Academy</text>
    </svg>
  `;
}

async function generateAssets() {
  console.log('Generating assets...\n');

  // Ensure directories exist
  const imagesDir = path.join(PUBLIC_DIR, 'images');
  const coursesDir = path.join(imagesDir, 'courses');

  if (!fs.existsSync(coursesDir)) {
    fs.mkdirSync(coursesDir, { recursive: true });
  }

  // 1. Generate icon-512.png (PWA)
  console.log('Creating icon-512.png...');
  await sharp(Buffer.from(createLogoSVG(512)))
    .png()
    .toFile(path.join(imagesDir, 'icon-512.png'));
  console.log('✓ icon-512.png created');

  // 2. Generate apple-touch-icon.png (180x180)
  console.log('Creating apple-touch-icon.png...');
  await sharp(Buffer.from(createLogoSVG(180)))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png created');

  // 3. Generate favicon-16x16.png
  console.log('Creating favicon-16x16.png...');
  await sharp(Buffer.from(createLogoSVG(16)))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
  console.log('✓ favicon-16x16.png created');

  // 4. Generate favicon-32x32.png (bonus)
  console.log('Creating favicon-32x32.png...');
  await sharp(Buffer.from(createLogoSVG(32)))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log('✓ favicon-32x32.png created');

  // 5. Generate favicon.ico (use 32x32 PNG as source)
  console.log('Creating favicon.ico...');
  await sharp(Buffer.from(createLogoSVG(32)))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
  console.log('✓ favicon.ico created (as PNG - browsers accept this)');

  // 6. Generate default-course.jpg (16:9 ratio - 800x450)
  console.log('Creating default-course.jpg...');
  await sharp(Buffer.from(createCoursePlaceholderSVG(800, 450)))
    .jpeg({ quality: 90 })
    .toFile(path.join(coursesDir, 'default-course.jpg'));
  console.log('✓ default-course.jpg created');

  // 7. Generate og-image.png (1200x630 for social sharing)
  console.log('Creating og-image.png...');
  const ogSVG = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e1b4b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#ogGrad)"/>
      <rect x="80" y="80" width="100" height="100" fill="white" rx="20"/>
      <text x="130" y="145" font-family="Arial" font-size="60" font-weight="bold" fill="${PRIMARY_COLOR}" text-anchor="middle">P</text>
      <text x="80" y="280" font-family="Arial" font-size="64" font-weight="bold" fill="white">Phazur Labs Academy</text>
      <text x="80" y="360" font-family="Arial" font-size="32" fill="rgba(255,255,255,0.8)">Learn without limits. Build your future.</text>
      <text x="80" y="550" font-family="Arial" font-size="24" fill="rgba(255,255,255,0.6)">Expert-led courses in software development, AI, and data science</text>
    </svg>
  `;
  await sharp(Buffer.from(ogSVG))
    .png()
    .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
  console.log('✓ og-image.png created');

  console.log('\n✅ All assets generated successfully!');
}

generateAssets().catch(console.error);
