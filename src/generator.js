const fs = require('fs-extra');
const path = require('path');

const { generateDataForType } = require('./data');
const { generateAbstractImage, generateCheckerboardImage, generateSizesFromAspectRatios, saveImage, generateFavicons } = require('./image');
const { saveDataToFormats } = require('./utils');
const { generateProgrammingCodes } = require('./utils/codeGenerator');
const { generateVideos } = require('./utils/videoGenerator');
const { generateAudio } = require('./utils/audioGenerator');
const { getFlatFavoriteSizes } = require('./config/favorite-sizes');

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
 * Creates image sizes by merging favorite sizes with aspect ratio generated sizes
 * @param {Object} config - Image configuration
 * @returns {Array} Array of size objects with width, height, and aspectRatio
 */
function createImageSizes(config) {
  let imageSizes = config.sizes || [];
  
  // Check if we should use favorites first
  const useFavoritesFirst = config['use-favorites-first'] ?? true;
  
  if (useFavoritesFirst && config['favorite-sizes']) {
    console.log('  - Using favorite sizes first...');
    
    // Get all favorite sizes
    const favoriteSizes = getFlatFavoriteSizes(true); // enabled only
    
    // Convert favorite sizes to the expected format with aspect ratio calculation
    const favoriteSizeObjects = favoriteSizes.map(fav => {
      // Calculate aspect ratio for favorite size
      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      const aspectGcd = gcd(fav.width, fav.height);
      const aspectWidth = fav.width / aspectGcd;
      const aspectHeight = fav.height / aspectGcd;
      const aspectRatio = `${aspectWidth}:${aspectHeight}`;
      
      return {
        width: fav.width,
        height: fav.height,
        aspectRatio: aspectRatio,
        name: fav.name,
        usage: fav.usage,
        isFavorite: true
      };
    });
    
    imageSizes = [...favoriteSizeObjects];
    console.log(`  - Added ${favoriteSizes.length} favorite sizes`);
  }
  
  // Add aspect ratio generated sizes if needed
  const shouldGenerateSizes = config['generate-sizes'] ?? true;
  if (shouldGenerateSizes) {
    const aspectRatios = config['aspect-ratios'] || ['16:9', '4:3', '1:1'];
    const baseSizes = config['base-sizes'] || [320, 480, 640, 800, 1024];
    
    // Generate additional sizes, but reduce count if we already have favorites
    const additionalCount = useFavoritesFirst && imageSizes.length > 0 
      ? Math.max(1, Math.floor(config.count / 2)) // Reduce generated count when using favorites
      : config.count;
    
    const generatedSizes = generateSizesFromAspectRatios(
      aspectRatios,
      baseSizes,
      additionalCount
    );
    
    // Mark generated sizes
    const markedGenerated = generatedSizes.map(size => ({
      ...size,
      isFavorite: false
    }));
    
    imageSizes = [...imageSizes, ...markedGenerated];
    console.log(`  - Added ${generatedSizes.length} aspect ratio generated sizes`);
  }
  
  return imageSizes;
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
    // Create image sizes using favorite sizes and aspect ratio generation
    const imageSizes = createImageSizes(config.images);
    
    console.log(`  - Total sizes to generate: ${imageSizes.length}`);

    // Group sizes by aspect ratio for organized directory structure
    const sizesByAspectRatio = {};
    imageSizes.forEach(size => {
      const aspectRatio = size.aspectRatio || 'custom';
      if (!sizesByAspectRatio[aspectRatio]) {
        sizesByAspectRatio[aspectRatio] = [];
      }
      sizesByAspectRatio[aspectRatio].push(size);
    });

    // Generate images organized by aspect ratio
    for (const [aspectRatio, sizes] of Object.entries(sizesByAspectRatio)) {
      // Convert aspect ratio to kebab-case directory name
      const ratioDir = aspectRatio.replace(':', '-').toLowerCase();
      
      console.log(`  - Generating ${sizes.length} sizes for aspect ratio ${aspectRatio}`);
      
      for (const size of sizes) {
        for (const format of config.images.formats) {
          // Generate both abstract and checkerboard images
          const abstractCanvas = generateAbstractImage(size.width, size.height, format);
          const checkerboardCanvas = generateCheckerboardImage(size.width, size.height, format);

          // Create filename with optional favorite indicator
          let filename = `${size.width}x${size.height}`;
          if (size.name && size.isFavorite) {
            filename = `${size.width}x${size.height}-${size.name}`;
          }

          // Save abstract images in organized folder structure
          const abstractDir = path.join(imagesDir, ratioDir, 'abstract');
          await saveImage(abstractCanvas, filename, format, abstractDir);

          // Save checkerboard images in organized folder structure
          const checkerboardDir = path.join(imagesDir, ratioDir, 'checkerboard');
          await saveImage(checkerboardCanvas, filename, format, checkerboardDir);
        }
      }
    }
    
    const totalImages = imageSizes.length * config.images.formats.length * 2;
    const favoriteCount = imageSizes.filter(s => s.isFavorite).length;
    const generatedCount = imageSizes.filter(s => !s.isFavorite).length;
    
    console.log(`  - Generated ${totalImages} images total (${favoriteCount} from favorites, ${generatedCount} from aspect ratios)`);
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

  // Generate programming codes (support both kebab-case and camelCase)
  const programmingConfig = config['programming-codes'] || config.programmingCodes;
  if (programmingConfig && programmingConfig.enabled) {
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
