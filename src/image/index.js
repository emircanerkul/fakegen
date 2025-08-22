const { generateAbstractImage, generateSizesFromAspectRatios } = require('./generator');
const { saveImage } = require('./saver');

module.exports = {
  generateAbstractImage,
  generateSizesFromAspectRatios,
  saveImage
};
