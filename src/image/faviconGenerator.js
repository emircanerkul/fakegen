const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const { faker } = require('@faker-js/faker');
const { saveImage } = require('./saver');

/**
 * Generate a simple favicon with geometric patterns
 * @param {number} size - Size of the favicon (width and height)
 * @returns {Sharp} Generated Sharp instance
 */
function generateFavicon(size) {
  // Generate a simple geometric favicon
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
  const bgColor = faker.helpers.arrayElement(colors);

  // Create SVG for the favicon
  let svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;

  // Background circle
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 2;
  svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${bgColor}" />`;

  // Add some geometric elements
  const elementCount = faker.number.int({ min: 2, max: 4 });
  for (let i = 0; i < elementCount; i++) {
    const elementType = faker.helpers.arrayElement(['circle', 'square', 'triangle']);
    const elementSize = faker.number.int({ min: 4, max: size / 3 });
    const x = faker.number.int({ min: elementSize, max: size - elementSize });
    const y = faker.number.int({ min: elementSize, max: size - elementSize });
    const rotation = faker.number.float({ min: 0, max: 360 });

    svgContent += `<g transform="translate(${x}, ${y}) rotate(${rotation})">`;

    switch (elementType) {
      case 'circle':
        svgContent += `<circle cx="0" cy="0" r="${elementSize / 2}" fill="rgba(255, 255, 255, 0.3)" />`;
        break;
      case 'square':
        svgContent += `<rect x="${-elementSize / 2}" y="${-elementSize / 2}" width="${elementSize}" height="${elementSize}" fill="rgba(255, 255, 255, 0.3)" />`;
        break;
      case 'triangle':
        const points = `0,${-elementSize / 2} ${-elementSize / 2},${elementSize / 2} ${elementSize / 2},${elementSize / 2}`;
        svgContent += `<polygon points="${points}" fill="rgba(255, 255, 255, 0.3)" />`;
        break;
    }

    svgContent += '</g>';
  }

  svgContent += '</svg>';

  return sharp(Buffer.from(svgContent));
}

/**
 * Generate favicons for all specified sizes and formats
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function generateFavicons(config, outputDir) {
  if (!config.favicons || !config.favicons.enabled) {
    return;
  }

  console.log('Generating favicons...');
  const faviconDir = path.join(outputDir, 'favicon');
  await fs.ensureDir(faviconDir);

  for (const size of config.favicons.sizes) {
    // Generate a favicon canvas
    const faviconCanvas = generateFavicon(size);

    for (const format of config.favicons.formats) {
      const filename = `favicon_${size}x${size}`;
      await saveImage(faviconCanvas, filename, format, faviconDir);
    }
  }

  console.log('Favicon generation completed!');
}

module.exports = {
  generateFavicon,
  generateFavicons
};
