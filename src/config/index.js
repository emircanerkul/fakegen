const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

// Import new modular configurations
const { getAllDataTypes } = require('./data-types');
const { getDefaultMediaConfig } = require('./media-configs');
const { getDefaultAspectRatios } = require('./aspect-ratios');
const { getBaseSizes } = require('./image-sizes');

// New kebab-case output configuration
const outputConfig = {
  directory: './fakegen',
  formats: ['json', 'csv', 'txt', 'yml', 'toml', 'xml']
};

// Get data type configurations with kebab-case naming
const dataTypeConfigs = getAllDataTypes();

// Get media configurations with kebab-case naming
const mediaConfigs = getDefaultMediaConfig();

// Default configuration with kebab-case naming
const defaultConfig = {
  output: outputConfig,
  data: {
    count: 10,
    types: dataTypeConfigs
  },
  ...mediaConfigs
};

/**
 * Validates configuration object
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be a valid object');
  }

  // Validate output configuration
  if (config.output) {
    if (config.output.directory && typeof config.output.directory !== 'string') {
      throw new Error('Output directory must be a string');
    }
    if (config.output.formats && !Array.isArray(config.output.formats)) {
      throw new Error('Output formats must be an array');
    }
  }

  // Validate data configuration
  if (config.data) {
    if (config.data.count !== undefined && (typeof config.data.count !== 'number' || config.data.count < 1)) {
      throw new Error('Data count must be a positive number');
    }
    if (config.data.types && typeof config.data.types !== 'object') {
      throw new Error('Data types must be an object');
    }
  }

  // Validate media configurations with kebab-case names
  const mediaTypes = ['images', 'favicons', 'programming-codes', 'videos', 'audio'];
  mediaTypes.forEach(type => {
    if (config[type] && config[type].enabled !== undefined && typeof config[type].enabled !== 'boolean') {
      throw new Error(`${type} enabled flag must be a boolean`);
    }
  });
}


/**
 * Merges user configuration with defaults recursively
 * @param {Object} defaultConfig - Default configuration
 * @param {Object} userConfig - User configuration
 * @returns {Object} Merged configuration
 */
function mergeConfigs(defaultConfig, userConfig) {
  const merged = { ...defaultConfig };

  Object.keys(userConfig).forEach(key => {
    if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
      merged[key] = mergeConfigs(defaultConfig[key] || {}, userConfig[key]);
    } else {
      merged[key] = userConfig[key];
    }
  });

  return merged;
}

/**
 * Load configuration from .fakegen.yml file
 * @returns {Promise<Object>} Configuration object
 */
async function loadConfig() {
  const configPath = path.join(process.cwd(), '.fakegen.yml');

  try {
    if (await fs.pathExists(configPath)) {
      const configContent = await fs.readFile(configPath, 'utf8');
      let userConfig = yaml.load(configContent);

      if (userConfig && typeof userConfig === 'object') {
        // Direct merge without legacy conversion
        const mergedConfig = mergeConfigs(defaultConfig, userConfig);
        validateConfig(mergedConfig);
        console.log('Configuration loaded from .fakegen.yml');
        return mergedConfig;
      } else {
        console.warn('Warning: Invalid configuration file format, using defaults');
      }
    } else {
      console.log('No configuration file found, using defaults');
    }
  } catch (error) {
    console.warn(`Warning: Could not load configuration file: ${error.message}, using defaults`);
  }

  return defaultConfig;
}

/**
 * Create default configuration file
 * @returns {Promise<void>}
 */
async function createDefaultConfig() {
  const configPath = path.join(process.cwd(), '.fakegen.yml');

  try {
    if (await fs.pathExists(configPath)) {
      console.log('.fakegen.yml already exists!');
      return;
    }

    await fs.writeFile(configPath, yaml.dump(defaultConfig, { indent: 2 }));
    console.log('Created .fakegen.yml configuration file');
  } catch (error) {
    throw new Error(`Failed to create default configuration file: ${error.message}`);
  }
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object to save
 * @param {string} filePath - Path to save configuration (optional)
 * @returns {Promise<void>}
 */
async function saveConfig(config, filePath = null) {
  const configPath = filePath || path.join(process.cwd(), '.fakegen.yml');

  try {
    validateConfig(config);
    await fs.writeFile(configPath, yaml.dump(config, { indent: 2 }));
    console.log(`Configuration saved to ${configPath}`);
  } catch (error) {
    throw new Error(`Failed to save configuration: ${error.message}`);
  }
}

module.exports = {
  loadConfig,
  createDefaultConfig,
  saveConfig,
  validateConfig,
  mergeConfigs,
  defaultConfig,
  dataTypeConfigs,
  outputConfig,
  mediaConfigs
};
