const sharp = require('sharp');
const { faker } = require('@faker-js/faker');

// Color palette for image generation
const VIBRANT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#FFB6C1', '#98FB98', '#F0E68C', '#87CEEB',
  '#FFA07A', '#20B2AA', '#9370DB', '#FF6347', '#00CED1'
];

/**
 * Validates input parameters
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} format - Image format
 * @throws {Error} If parameters are invalid
 */
function validateImageParams(width, height, format) {
  if (typeof width !== 'number' || width < 1) {
    throw new Error('Width must be a positive number');
  }
  if (typeof height !== 'number' || height < 1) {
    throw new Error('Height must be a positive number');
  }
  const validFormats = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
  if (!validFormats.includes(format?.toLowerCase())) {
    throw new Error(`Format must be one of: ${validFormats.join(', ')}`);
  }
}

/**
 * Gets random color from palette
 * @param {boolean} transparent - Whether to make the color semi-transparent
 * @returns {string} Color string
 */
function getRandomColor(transparent = false) {
  const color = faker.helpers.arrayElement(VIBRANT_COLORS);
  return transparent ? `${color}80` : color;
}

/**
 * Gets two different random colors
 * @param {boolean} secondTransparent - Whether to make the second color semi-transparent
 * @returns {Array<string>} Array of two color strings
 */
function getRandomColorPair(secondTransparent = false) {
  let color1 = getRandomColor();
  let color2 = getRandomColor(secondTransparent);

  // Ensure colors are different
  while (color1 === color2) {
    color2 = getRandomColor(secondTransparent);
  }

  return [color1, color2];
}

/**
 * Creates SVG background
 * @param {number} baseSize - Base image size
 * @param {string} format - Image format
 * @returns {string} SVG background content
 */
function createSvgBackground(baseSize, format) {
  if (format === 'png') {
    const bgAlpha = 0.3 + Math.random() * 0.4;
    const bgColor = getRandomColor();
    return `<rect width="100%" height="100%" fill="${bgColor}" opacity="${bgAlpha}" />`;
  } else {
    return `<defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
        <stop offset="20%" style="stop-color:#4ECDC4;stop-opacity:1" />
        <stop offset="40%" style="stop-color:#45B7D1;stop-opacity:1" />
        <stop offset="60%" style="stop-color:#96CEB4;stop-opacity:1" />
        <stop offset="80%" style="stop-color:#FFEAA7;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#DDA0DD;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="overlayGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
        <stop offset="50%" style="stop-color:white;stop-opacity:0" />
        <stop offset="100%" style="stop-color:black;stop-opacity:0.1" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGradient)" />
    <rect width="100%" height="100%" fill="url(#overlayGradient)" />`;
  }
}

/**
 * Creates SVG shape
 * @param {number} baseSize - Base image size
 * @param {string} shapeType - Type of shape to create
 * @param {string} layer - Layer type (large, medium, small)
 * @returns {string} SVG shape content
 */
function createSvgShape(baseSize, shapeType, layer) {
  const x = Math.random() * baseSize;
  const y = Math.random() * baseSize;
  const color = getRandomColor();
  const opacity = layer === 'large' ? 0.4 + Math.random() * 0.3 :
    layer === 'medium' ? 0.5 + Math.random() * 0.3 :
      0.6 + Math.random() * 0.3;

  const maxSize = layer === 'large' ? 0.4 : layer === 'medium' ? 0.2 : 0.1;
  const minSize = layer === 'large' ? 100 : layer === 'medium' ? 50 : 15;
  const size = Math.random() * Math.min(baseSize, baseSize) * maxSize + minSize;

  switch (shapeType) {
    case 'circle':
      return `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}" opacity="${opacity}" />`;

    case 'rectangle':
      const rectWidth = size * (0.6 + Math.random() * 0.6);
      const rectHeight = size * (0.6 + Math.random() * 0.6);
      const radius = Math.min(rectWidth, rectHeight) * 0.2;
      return `<rect x="${x - rectWidth / 2}" y="${y - rectHeight / 2}" width="${rectWidth}" height="${rectHeight}" rx="${radius}" ry="${radius}" fill="${color}" opacity="${opacity}" />`;

    case 'ellipse':
      const rx = size * (0.3 + Math.random() * 0.4);
      const ry = size * (0.3 + Math.random() * 0.4);
      const rotation = Math.random() * 360;
      return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})" />`;

    case 'triangle':
      const points = `${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}`;
      return `<polygon points="${points}" fill="${color}" opacity="${opacity}" />`;

    case 'star':
      const starPoints = [];
      for (let j = 0; j < 10; j++) {
        const angle = (j * Math.PI) / 5;
        const radius = j % 2 === 0 ? size / 2 : size / 4;
        const starX = x + Math.cos(angle) * radius;
        const starY = y + Math.sin(angle) * radius;
        starPoints.push(`${starX},${starY}`);
      }
      return `<polygon points="${starPoints.join(' ')}" fill="${color}" opacity="${opacity}" />`;

    case 'pentagon':
      const pentagonPoints = [];
      for (let j = 0; j < 5; j++) {
        const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
        const pentX = x + Math.cos(angle) * (size / 2);
        const pentY = y + Math.sin(angle) * (size / 2);
        pentagonPoints.push(`${pentX},${pentY}`);
      }
      return `<polygon points="${pentagonPoints.join(' ')}" fill="${color}" opacity="${opacity}" />`;

    case 'square':
      return `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="${color}" opacity="${opacity}" />`;

    case 'diamond':
      const diamondSize = size * 0.7;
      const diamondRotation = 45;
      return `<rect x="${x - diamondSize / 2}" y="${y - diamondSize / 2}" width="${diamondSize}" height="${diamondSize}" fill="${color}" opacity="${opacity}" transform="rotate(${diamondRotation} ${x} ${y})" />`;

    default:
      return `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}" opacity="${opacity}" />`;
  }
}

/**
 * Generate sizes based on aspect ratios
 * @param {Array<string>} aspectRatios - Array of aspect ratios like ['16:9', '4:3']
 * @param {Array<number>} baseSizes - Array of base sizes (widths)
 * @param {number} count - Number of sizes to generate
 * @returns {Array<{width: number, height: number, aspectRatio: string}>} Generated sizes
 * @throws {Error} If parameters are invalid
 */
function generateSizesFromAspectRatios(aspectRatios, baseSizes, count) {
  if (!Array.isArray(aspectRatios) || aspectRatios.length === 0) {
    throw new Error('Aspect ratios must be a non-empty array');
  }
  if (!Array.isArray(baseSizes) || baseSizes.length === 0) {
    throw new Error('Base sizes must be a non-empty array');
  }
  if (typeof count !== 'number' || count < 1) {
    throw new Error('Count must be a positive number');
  }

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
 * Creates checkerboard pattern SVG content
 * @param {number} baseSize - Base image size
 * @param {number} squareSize - Size of each square
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @returns {string} SVG checkerboard content
 */
function createCheckerboardSvg(baseSize, squareSize, color1, color2) {
  let svgContent = `<svg width="${baseSize}" height="${baseSize}" xmlns="http://www.w3.org/2000/svg">`;

  // Generate checkerboard pattern using rectangles
  for (let y = 0; y < baseSize; y += squareSize) {
    for (let x = 0; x < baseSize; x += squareSize) {
      const colorIndex = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2;
      const fillColor = colorIndex === 0 ? color1 : color2;
      const rectWidth = Math.min(squareSize, baseSize - x);
      const rectHeight = Math.min(squareSize, baseSize - y);

      svgContent += `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${fillColor}" />`;
    }
  }

  // Add decorative border
  svgContent += `<rect x="2" y="2" width="${baseSize - 4}" height="${baseSize - 4}" fill="none" stroke="white" stroke-width="4" />`;

  svgContent += '</svg>';
  return svgContent;
}

/**
 * Generate checkerboard image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} format - Image format
 * @returns {Object|Sharp} For SVG format returns {sharp: Sharp, svgContent: string}, otherwise returns Sharp instance
 * @throws {Error} If parameters are invalid
 */
function generateCheckerboardImage(width, height, format = 'jpg') {
  validateImageParams(width, height, format);

  // Handle 1x1 images and ensure minimum dimensions
  const originalWidth = width;
  const originalHeight = height;
  width = Math.max(width, 100);
  height = Math.max(height, 100);

  // Generate a large base image (2048x2048) and then resize
  const baseSize = 2048;

  // Get two different colors
  const [color1, color2] = getRandomColorPair(format === 'png');

  // Determine square size for base image
  const squareSize = Math.max(40, Math.floor(baseSize / 15));

  // Create SVG content
  const svgContent = createCheckerboardSvg(baseSize, squareSize, color1, color2);

  // Create Sharp instance and resize
  const sharpInstance = sharp(Buffer.from(svgContent))
    .resize(originalWidth, originalHeight, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: false
    });

  // For SVG format, return both the Sharp instance and original SVG content
  if (format === 'svg') {
    // Scale the SVG content to the target dimensions
    const targetSize = Math.max(originalWidth, originalHeight);
    const targetSquareSize = Math.max(10, Math.floor(targetSize / 15));
    const scaledSvgContent = createCheckerboardSvg(targetSize, targetSquareSize, color1, color2)
      .replace(/width="\d+"/, `width="${originalWidth}"`)
      .replace(/height="\d+"/, `height="${originalHeight}"`);
    
    return {
      sharp: sharpInstance,
      svgContent: scaledSvgContent
    };
  }

  return sharpInstance;
}

/**
 * Creates abstract art SVG content
 * @param {number} baseSize - Base image size
 * @param {string} format - Image format
 * @returns {string} SVG abstract art content
 */
function createAbstractSvg(baseSize, format) {
  let svgContent = `<svg width="${baseSize}" height="${baseSize}" xmlns="http://www.w3.org/2000/svg">`;

  // Add background
  svgContent += createSvgBackground(baseSize, format);

  // Layer 1: Large shapes (circles, rectangles, ellipses)
  for (let i = 0; i < 3; i++) {
    const shapeType = Math.random();
    if (shapeType < 0.4) {
      svgContent += createSvgShape(baseSize, 'circle', 'large');
    } else if (shapeType < 0.7) {
      svgContent += createSvgShape(baseSize, 'rectangle', 'large');
    } else {
      svgContent += createSvgShape(baseSize, 'ellipse', 'large');
    }
  }

  // Layer 2: Medium shapes (triangles, stars, pentagons)
  for (let i = 0; i < 5; i++) {
    const shapeType = Math.random();
    if (shapeType < 0.5) {
      svgContent += createSvgShape(baseSize, 'triangle', 'medium');
    } else if (shapeType < 0.8) {
      svgContent += createSvgShape(baseSize, 'star', 'medium');
    } else {
      svgContent += createSvgShape(baseSize, 'pentagon', 'medium');
    }
  }

  // Layer 3: Small accent shapes (circles, squares, diamonds)
  for (let i = 0; i < 10; i++) {
    const accentType = Math.random();
    if (accentType < 0.4) {
      svgContent += createSvgShape(baseSize, 'circle', 'small');
    } else if (accentType < 0.7) {
      svgContent += createSvgShape(baseSize, 'square', 'small');
    } else {
      svgContent += createSvgShape(baseSize, 'diamond', 'small');
    }
  }

  // Add decorative border
  svgContent += `<rect x="2" y="2" width="${baseSize - 4}" height="${baseSize - 4}" fill="none" stroke="white" stroke-width="4" />`;

  svgContent += '</svg>';
  return svgContent;
}

/**
 * Generate abstract image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} format - Image format
 * @returns {Object|Sharp} For SVG format returns {sharp: Sharp, svgContent: string}, otherwise returns Sharp instance
 * @throws {Error} If parameters are invalid
 */
function generateAbstractImage(width, height, format = 'jpg') {
  validateImageParams(width, height, format);

  // Handle 1x1 images and ensure minimum dimensions
  const originalWidth = width;
  const originalHeight = height;
  width = Math.max(width, 100);
  height = Math.max(height, 100);

  // Generate a large base image (2048x2048) and then resize
  const baseSize = 2048;

  // Create SVG content
  const svgContent = createAbstractSvg(baseSize, format);

  // Create Sharp instance and resize
  const sharpInstance = sharp(Buffer.from(svgContent))
    .resize(originalWidth, originalHeight, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: false
    });

  // For SVG format, return both the Sharp instance and original SVG content
  if (format === 'svg') {
    // Scale the SVG content to the target dimensions
    const scaledSvgContent = createAbstractSvg(Math.max(originalWidth, originalHeight), format)
      .replace(/width="\d+"/, `width="${originalWidth}"`)
      .replace(/height="\d+"/, `height="${originalHeight}"`);
    
    return {
      sharp: sharpInstance,
      svgContent: scaledSvgContent
    };
  }

  return sharpInstance;
}

module.exports = {
  generateAbstractImage,
  generateCheckerboardImage,
  generateSizesFromAspectRatios,
  // Export helper functions for testing and reuse
  validateImageParams,
  getRandomColor,
  getRandomColorPair,
  createSvgBackground,
  createSvgShape,
  createCheckerboardSvg,
  createAbstractSvg,
  VIBRANT_COLORS
};
