const fs = require('fs-extra');
const path = require('path');

const { generateDataForType } = require('./data');
const { generateAbstractImage, generateCheckerboardImage, generateSizesFromAspectRatios, saveImage, generateFavicons } = require('./image');
const { saveDataToFormats } = require('./utils');
const { generateProgrammingCodes } = require('./utils/codeGenerator');
const { generateVideos } = require('./utils/videoGenerator');
const { generateAudio } = require('./utils/audioGenerator');

/**
 * Validates the configuration object
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  if (!config) {
    throw new Error('Configuration is required');
  }

  if (!config.output || !config.output.directory) {
    throw new Error('Output directory is required in configuration');
  }

  if (!config.data || !config.data.types) {
    throw new Error('Data types are required in configuration');
  }
}

/**
 * Generates fake data for all enabled types
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory path
 * @returns {Promise<void>}
 */
async function generateData(config, outputDir) {
  console.log('Generating fake data...');

  for (const [typeName, typeConfig] of Object.entries(config.data.types)) {
    if (!typeConfig.enabled) continue;

    try {
      console.log(`  - Generating ${typeName} data...`);
      const data = generateDataForType(typeConfig, config.data.count);

      if (config.output.formats && config.output.formats.length > 0) {
        await saveDataToFormats(data, typeName, outputDir, config.output.formats);
      }
    } catch (error) {
      console.error(`Error generating ${typeName} data:`, error.message);
    }
  }
}

/**
 * Generates images based on configuration
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory path
 * @returns {Promise<void>}
 */
async function generateImages(config, outputDir) {
  if (!config.images.enabled) return;

  console.log('Generating fake images...');
  const imagesDir = path.join(outputDir, 'images');
  await fs.ensureDir(imagesDir);

  try {
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
        // Generate both abstract and checkerboard images
        const abstractCanvas = generateAbstractImage(size.width, size.height, format);
        const checkerboardCanvas = generateCheckerboardImage(size.width, size.height, format);

        // Save abstract images in new folder structure
        const abstractDir = path.join(imagesDir, 'abstract');
        const abstractFilename = `${size.width}x${size.height}`;
        await saveImage(abstractCanvas, abstractFilename, format, abstractDir);

        // Save checkerboard images in new folder structure
        const checkerboardDir = path.join(imagesDir, 'checkerboard');
        const checkerboardFilename = `${size.width}x${size.height}`;
        await saveImage(checkerboardCanvas, checkerboardFilename, format, checkerboardDir);
      }
    }
    console.log(`  - Generated ${imageSizes.length * config.images.formats.length * 2} images`);
  } catch (error) {
    console.error('Error generating images:', error.message);
  }
}

/**
 * Generates additional content types (favicons, programming codes, videos, audio)
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory path
 * @returns {Promise<void>}
 */
async function generateAdditionalContent(config, outputDir) {
  const tasks = [];

  // Generate favicons
  if (config.favicons && config.favicons.enabled) {
    tasks.push((async () => {
      try {
        console.log('Generating favicons...');
        await generateFavicons(config, outputDir);
      } catch (error) {
        console.error('Error generating favicons:', error.message);
      }
    })());
  }

  // Generate programming codes
  if (config.programmingCodes && config.programmingCodes.enabled) {
    tasks.push((async () => {
      try {
        console.log('Generating programming codes...');
        await generateProgrammingCodes(config, outputDir);
      } catch (error) {
        console.error('Error generating programming codes:', error.message);
      }
    })());
  }

  // Generate videos
  if (config.videos && config.videos.enabled) {
    tasks.push((async () => {
      try {
        console.log('Generating videos...');
        await generateVideos(config, outputDir);
      } catch (error) {
        console.error('Error generating videos:', error.message);
      }
    })());
  }

  // Generate audio
  if (config.audio && config.audio.enabled) {
    tasks.push((async () => {
      try {
        console.log('Generating audio...');
        await generateAudio(config, outputDir);
      } catch (error) {
        console.error('Error generating audio:', error.message);
      }
    })());
  }

  await Promise.all(tasks);
}

/**
 * Main generation function
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
async function generateFakeData(config) {
  try {
    validateConfig(config);

    const outputDir = path.resolve(config.output.directory);
    await fs.ensureDir(outputDir);

    console.log(`Generating fake data to: ${outputDir}`);

    // Generate different types of content
    await generateData(config, outputDir);
    await generateImages(config, outputDir);
    await generateAdditionalContent(config, outputDir);

    console.log('Fake data generation completed successfully!');
  } catch (error) {
    console.error('Error during fake data generation:', error.message);
    throw error;
  }
}

module.exports = {
  generateFakeData
};
