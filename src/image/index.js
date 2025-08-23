const { generateAbstractImage, generateCheckerboardImage, generateSizesFromAspectRatios } = require('./generator');
const { saveImage } = require('./saver');
const { generateFavicons } = require('./faviconGenerator');

module.exports = {
  generateAbstractImage,
  generateCheckerboardImage,
  generateSizesFromAspectRatios,
  saveImage,
  generateFavicons
};
