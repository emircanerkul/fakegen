#!/usr/bin/env node

/**
 * FakeGen - Main module entry point
 * 
 * This file serves as the main entry point for the FakeGen package when used as a library.
 * It exports all the core functionality that can be imported and used programmatically.
 * 
 * For CLI usage, use the bin/fakegen.js executable instead.
 */

// Import core generation functionality
const { generateFakeData } = require('./generator');

// Import configuration management
const { 
  loadConfig, 
  createDefaultConfig, 
  saveConfig, 
  validateConfig, 
  mergeConfigs, 
  defaultConfig 
} = require('./config');

// Import data generation functions
const { 
  generateFakeDataForField, 
  generateDataForType,
  convertToCSV,
  convertToTXT,
  convertToYML,
  convertToTOML,
  convertToXML
} = require('./data');

// Import image generation functions
const { 
  generateAbstractImage, 
  generateCheckerboardImage, 
  generateSizesFromAspectRatios, 
  saveImage, 
  generateFavicons 
} = require('./image');

// Import utility functions
const { saveDataToFormats } = require('./utils');

// Import additional content generators (with graceful error handling)
let generateProgrammingCodes, generateVideos, generateAudio;

try {
  ({ generateProgrammingCodes } = require('./utils/codeGenerator'));
} catch (error) {
  console.warn('Code generation not available:', error.message);
  generateProgrammingCodes = null;
}

try {
  ({ generateVideos } = require('./utils/videoGenerator'));
} catch (error) {
  console.warn('Video generation not available:', error.message);
  generateVideos = null;
}

try {
  ({ generateAudio } = require('./utils/audioGenerator'));
} catch (error) {
  console.warn('Audio generation not available:', error.message);
  generateAudio = null;
}

/**
 * Main FakeGen API exports
 * 
 * These exports provide both the high-level generateFakeData function
 * and individual components for more granular control.
 */
module.exports = {
  // Core generation function
  generateFakeData,

  // Configuration management
  loadConfig,
  createDefaultConfig,
  saveConfig,
  validateConfig,
  mergeConfigs,
  defaultConfig,

  // Data generation
  generateFakeDataForField,
  generateDataForType,
  saveDataToFormats,

  // Data formatters
  convertToCSV,
  convertToTXT,
  convertToYML,
  convertToTOML,
  convertToXML,

  // Image generation
  generateAbstractImage,
  generateCheckerboardImage,
  generateSizesFromAspectRatios,
  saveImage,
  generateFavicons,

  // Additional content generators (may be null if dependencies not available)
  generateProgrammingCodes,
  generateVideos,
  generateAudio,
};

// CLI detection and helper message
if (require.main === module) {
  console.log('FakeGen Library Entry Point');
  console.log('');
  console.log('This is the library entry point for FakeGen.');
  console.log('For CLI usage, use: npx fakegen or npm start');
  console.log('');
  console.log('For library usage example:');
  console.log('  const { generateFakeData, loadConfig } = require("fakegen");');
  console.log('  const config = await loadConfig();');
  console.log('  await generateFakeData(config);');
  console.log('');
  console.log('Available functions:', Object.keys(module.exports).join(', '));
}