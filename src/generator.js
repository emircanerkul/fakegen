const fs = require('fs-extra');
const path = require('path');
const { faker } = require('@faker-js/faker');

const { generateDataForType } = require('./data');
const { generateAbstractImage, generateSizesFromAspectRatios, saveImage } = require('./image');
const { saveDataToFormats } = require('./utils');

/**
 * Main generation function
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
async function generateFakeData(config) {
  const outputDir = path.resolve(config.output.directory);
  await fs.ensureDir(outputDir);

  console.log(`Generating fake data to: ${outputDir}`);

  // Generate data
  for (const [typeName, typeConfig] of Object.entries(config.data.types)) {
    if (!typeConfig.enabled) continue;

    console.log(`Generating ${typeName} data...`);
    const data = generateDataForType(typeConfig, config.data.count);

    if (config.output.formats && config.output.formats.length > 0) {
      await saveDataToFormats(data, typeName, outputDir, config.output.formats);
    }
  }

  // Generate images
  if (config.images.enabled) {
    console.log('Generating fake images...');
    const imagesDir = path.join(outputDir, 'images');
    await fs.ensureDir(imagesDir);

    // Generate sizes based on aspect ratios if enabled, otherwise use existing sizes
    let imageSizes = config.images.sizes || [];
    if (config.images.generateSizes && config.images.aspectRatios && config.images.baseSizes) {
      imageSizes = generateSizesFromAspectRatios(
        config.images.aspectRatios,
        config.images.baseSizes,
        config.images.count
      );
    }

    for (let i = 0; i < imageSizes.length; i++) {
      const size = imageSizes[i];

      for (const format of config.images.formats) {
        // Generate a fresh canvas for each format to handle transparency correctly
        const imageCanvas = generateAbstractImage(size.width, size.height, format);
        const filename = `abstract_${i + 1}_${size.width}x${size.height}_${size.aspectRatio || 'custom'}`;
        await saveImage(imageCanvas, filename, format, imagesDir);
      }
    }
  }

  console.log('Fake data generation completed!');
}

module.exports = {
  generateFakeData
};
