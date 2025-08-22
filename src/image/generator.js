const { createCanvas } = require('canvas');
const { faker } = require('@faker-js/faker');
const crypto = require('crypto');

/**
 * Generate sizes based on aspect ratios
 * @param {Array<string>} aspectRatios - Array of aspect ratios like ['16:9', '4:3']
 * @param {Array<number>} baseSizes - Array of base sizes (widths)
 * @param {number} count - Number of sizes to generate
 * @returns {Array<{width: number, height: number, aspectRatio: string}>} Generated sizes
 */
function generateSizesFromAspectRatios(aspectRatios, baseSizes, count) {
  const sizes = [];

  for (let i = 0; i < count; i++) {
    const aspectRatio = faker.helpers.arrayElement(aspectRatios);
    const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
    const baseSize = faker.helpers.arrayElement(baseSizes);

    // Calculate dimensions based on aspect ratio
    const width = baseSize;
    const height = Math.round((baseSize * ratioHeight) / ratioWidth);

    sizes.push({
      width,
      height,
      aspectRatio
    });
  }

  return sizes;
}

/**
 * Generate abstract image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Canvas} Generated canvas
 */
function generateAbstractImage(width, height, format = 'jpg') {
  // Handle 1x1 images
  const originalWidth = width;
  const originalHeight = height;
  width = Math.max(width, 50);
  height = Math.max(height, 50);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Clear the canvas first
  ctx.clearRect(0, 0, width, height);

  // Pastel color palette
  const pastelColors = [
    '#FFB3D9', '#FFE6B3', '#D9FFB3', '#B3FFE6', '#B3D9FF',
    '#E6B3FF', '#FFB3E6', '#FFD9B3', '#E6FFB3', '#B3FFCC',
    '#CCB3FF', '#FFB3CC', '#FFF0B3', '#B3FFF0', '#F0B3FF',
    '#FFB3F0', '#F0FFB3', '#B3F0FF', '#E0B3FF', '#FFB3E0'
  ];

  // Create gradient background based on format
  if (format === 'png') {
    // Subtle transparent gradient for PNG
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    bgGradient.addColorStop(0.5, 'rgba(240, 248, 255, 0.1)');
    bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Beautiful pastel gradient background for other formats
    const hue1 = faker.number.int({ min: 0, max: 360 });
    const hue2 = (hue1 + faker.number.int({ min: 60, max: 120 })) % 360;
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, `hsl(${hue1}, 35%, 88%)`);
    bgGradient.addColorStop(0.5, `hsl(${hue2}, 25%, 92%)`);
    bgGradient.addColorStop(1, `hsl(${(hue1 + 180) % 360}, 15%, 85%)`);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Generate organic blob shapes
  const shapeCount = Math.max(8, Math.floor(Math.sqrt(width * height) / 25));
  for (let i = 0; i < shapeCount; i++) {
    const x = faker.number.int({ min: 0, max: width });
    const y = faker.number.int({ min: 0, max: height });
    const minSize = Math.min(30, Math.floor(Math.min(width, height) / 4));
    const maxSize = Math.max(minSize + 10, Math.floor(Math.min(width, height) / 2));
    const size = faker.number.int({ min: Math.min(minSize, maxSize), max: Math.max(minSize, maxSize) });

    // Use pastel colors with varying opacity
    const baseColor = faker.helpers.arrayElement(pastelColors);
    const alpha = faker.number.float({ min: 0.3, max: 0.7 });
    ctx.fillStyle = baseColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(faker.number.float({ min: 0, max: Math.PI * 2 }));

    // Create organic blob shape
    ctx.beginPath();
    const points = faker.number.int({ min: 8, max: 16 });
    for (let j = 0; j <= points; j++) {
      const angle = (j / points) * Math.PI * 2;
      const radius = size * (0.6 + faker.number.float({ min: 0, max: 0.6 }));
      const xOffset = Math.cos(angle) * radius;
      const yOffset = Math.sin(angle) * radius;
      if (j === 0) {
        ctx.moveTo(xOffset, yOffset);
      } else {
        ctx.lineTo(xOffset, yOffset);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Add flowing wave patterns
  const waveCount = Math.max(3, Math.floor(Math.sqrt(width * height) / 80));
  for (let i = 0; i < waveCount; i++) {
    ctx.save();
    ctx.strokeStyle = faker.helpers.arrayElement(pastelColors).replace(')', ', 0.4)').replace('rgb', 'rgba');
    ctx.lineWidth = faker.number.int({ min: 3, max: 8 });
    ctx.lineCap = 'round';

    const startY = faker.number.int({ min: 0, max: height });
    const amplitude = faker.number.int({ min: 20, max: height / 2 });
    const frequency = faker.number.float({ min: 0.008, max: 0.03 });

    ctx.beginPath();
    ctx.moveTo(0, startY);
    for (let x = 0; x <= width; x += 3) {
      const y = startY + Math.sin(x * frequency) * amplitude;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Add scattered dots
  const dotCount = Math.max(15, Math.floor(Math.sqrt(width * height) / 15));
  for (let i = 0; i < dotCount; i++) {
    const dotX = faker.number.int({ min: 0, max: width });
    const dotY = faker.number.int({ min: 0, max: height });
    const dotSize = faker.number.int({ min: 1, max: Math.max(2, Math.min(5, Math.floor(Math.min(width, height) / 20))) });

    ctx.fillStyle = faker.helpers.arrayElement(pastelColors).replace(')', ', 0.5)').replace('rgb', 'rgba');
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add geometric elements
  const geometricCount = Math.max(4, Math.floor(Math.sqrt(width * height) / 50));
  for (let i = 0; i < geometricCount; i++) {
    const geoType = faker.helpers.arrayElement(['triangle', 'square', 'circle']);
    const geoX = faker.number.int({ min: 20, max: width - 20 });
    const geoY = faker.number.int({ min: 20, max: height - 20 });
    const geoSize = faker.number.int({ min: 15, max: Math.max(16, Math.min(40, Math.floor(Math.min(width, height) / 10))) });

    ctx.save();
    ctx.translate(geoX, geoY);
    ctx.rotate(faker.number.float({ min: 0, max: Math.PI * 2 }));

    ctx.fillStyle = faker.helpers.arrayElement(pastelColors).replace(')', ', 0.4)').replace('rgb', 'rgba');

    switch (geoType) {
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -geoSize);
        ctx.lineTo(-geoSize, geoSize);
        ctx.lineTo(geoSize, geoSize);
        ctx.closePath();
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-geoSize / 2, -geoSize / 2, geoSize, geoSize);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, geoSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    ctx.restore();
  }

  // Add subtle radial gradients for depth
  const gradientCount = Math.max(2, Math.floor(Math.sqrt(width * height) / 120));
  for (let i = 0; i < gradientCount; i++) {
    const centerX = faker.number.int({ min: 0, max: width });
    const centerY = faker.number.int({ min: 0, max: height });
    const radius = faker.number.int({ min: 80, max: Math.max(width, height) });

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    const baseHue = faker.number.int({ min: 0, max: 360 });
    gradient.addColorStop(0, `hsla(${baseHue}, 30%, 75%, 0.08)`);
    gradient.addColorStop(0.6, `hsla(${(baseHue + 60) % 360}, 20%, 85%, 0.04)`);
    gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Handle very small images (like 1x1)
  if (originalWidth !== width || originalHeight !== height) {
    const finalCanvas = createCanvas(originalWidth, originalHeight);
    const finalCtx = finalCanvas.getContext('2d');

    if (originalWidth === 1 && originalHeight === 1) {
      // For 1x1 images, just take a single pixel sample
      const imageData = ctx.getImageData(faker.number.int({ min: 0, max: width - 1 }),
        faker.number.int({ min: 0, max: height - 1 }), 1, 1);
      finalCtx.putImageData(imageData, 0, 0);
    } else {
      // Scale the generated image to fit the requested size
      finalCtx.drawImage(canvas, 0, 0, originalWidth, originalHeight);
    }
    return finalCanvas;
  }

  return canvas;
}

module.exports = {
  generateAbstractImage,
  generateSizesFromAspectRatios
};
