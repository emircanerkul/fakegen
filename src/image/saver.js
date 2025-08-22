const fs = require('fs-extra');
const path = require('path');

/**
 * Save image in different formats
 * @param {Canvas} imageCanvas - Canvas object
 * @param {string} filename - Filename without extension
 * @param {string} format - Image format (jpg, png)
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function saveImage(imageCanvas, filename, format, outputDir) {
  const formatDir = path.join(outputDir, format);
  await fs.ensureDir(formatDir);

  const filepath = path.join(formatDir, `${filename}.${format}`);
  let buffer;

  try {
    switch (format) {
      case 'png':
        buffer = imageCanvas.toBuffer('image/png');
        break;
      case 'jpg':
      case 'jpeg':
        buffer = imageCanvas.toBuffer('image/jpeg');
        break;
      default:
        buffer = imageCanvas.toBuffer('image/png');
    }

    await fs.writeFile(filepath, buffer);
    console.log(`Generated ${format.toUpperCase()} image: ${filepath}`);
  } catch (error) {
    console.error(`Error generating ${format} image:`, error.message);
  }
}

module.exports = {
  saveImage
};
