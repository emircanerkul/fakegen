const fs = require('fs-extra');
const path = require('path');

/**
 * Save image in different formats
 * @param {Sharp} sharpInstance - Sharp instance
 * @param {string} filename - Filename without extension
 * @param {string} format - Image format (jpg, png, webp, ico)
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function saveImage(sharpInstance, filename, format, outputDir) {
  const formatDir = path.join(outputDir, format);
  await fs.ensureDir(formatDir);

  const filepath = path.join(formatDir, `${filename}.${format}`);

  try {
    let buffer;

    switch (format) {
      case 'png':
        buffer = await sharpInstance.png().toBuffer();
        break;
      case 'jpg':
      case 'jpeg':
        buffer = await sharpInstance.jpeg({ quality: 90 }).toBuffer();
        break;
      case 'webp':
        try {
          buffer = await sharpInstance.webp({ quality: 90 }).toBuffer();
          if (!buffer || buffer.length === 0) {
            throw new Error('Empty WebP buffer');
          }
        } catch (webpError) {
          console.warn(`WebP generation failed (${webpError.message}), falling back to PNG for ${filename}`);
          buffer = await sharpInstance.png().toBuffer();
        }
        break;
      case 'ico':
        // For ICO format, convert to PNG first then create ICO
        const pngBuffer = await sharpInstance.png().toBuffer();
        buffer = createICOBFromPNG(pngBuffer);
        break;
      default:
        buffer = await sharpInstance.png().toBuffer();
    }

    await fs.writeFile(filepath, buffer);
    console.log(`Generated ${format.toUpperCase()} image: ${filepath}`);
  } catch (error) {
    console.error(`Error generating ${format} image:`, error.message);
  }
}

/**
 * Create ICO buffer from PNG buffer (simple implementation for square images)
 * @param {Buffer} pngBuffer - PNG buffer
 * @returns {Buffer} ICO buffer
 */
function createICOBFromPNG(pngBuffer) {
  // ICO header (6 bytes)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type (1 = ICO)
  icoHeader.writeUInt16LE(1, 4); // Number of images

  // ICO directory entry (16 bytes)
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0); // Width (32x32, 0 = 256)
  dirEntry.writeUInt8(32, 1); // Height (32x32, 0 = 256)
  dirEntry.writeUInt8(0, 2); // Color count (0 = no palette)
  dirEntry.writeUInt8(0, 3); // Reserved
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // Size of PNG data
  dirEntry.writeUInt32LE(22, 12); // Offset to PNG data

  // Combine header, directory entry, and PNG data
  return Buffer.concat([icoHeader, dirEntry, pngBuffer]);
}

module.exports = {
  saveImage
};
