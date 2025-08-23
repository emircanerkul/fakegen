const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

// Data type configurations
const dataTypeConfigs = {
  users: {
    enabled: true,
    fields: [
      { name: 'id', type: 'number' },
      { name: 'firstName', type: 'firstName' },
      { name: 'lastName', type: 'lastName' },
      { name: 'email', type: 'email' },
      { name: 'phone', type: 'phoneNumber' },
      { name: 'address', type: 'address' },
      { name: 'company', type: 'companyName' },
      {
        name: 'profile',
        type: 'nested',
        fields: [
          { name: 'bio', type: 'paragraph' },
          { name: 'avatar', type: 'text' },
          {
            name: 'socialLinks', type: 'nestedArray', count: 3, fields: [
              { name: 'platform', type: 'text' },
              { name: 'url', type: 'text' }
            ]
          }
        ]
      }
    ]
  },
  products: {
    enabled: true,
    fields: [
      { name: 'id', type: 'number' },
      { name: 'name', type: 'productName' },
      { name: 'description', type: 'productDescription' },
      { name: 'price', type: 'price' },
      { name: 'category', type: 'productCategory' },
      { name: 'inStock', type: 'boolean' },
      {
        name: 'specifications',
        type: 'nested',
        fields: [
          { name: 'weight', type: 'number' },
          {
            name: 'dimensions', type: 'nested', fields: [
              { name: 'width', type: 'number' },
              { name: 'height', type: 'number' },
              { name: 'depth', type: 'number' }
            ]
          },
          { name: 'materials', type: 'array', count: 3, itemType: 'text' }
        ]
      },
      {
        name: 'reviews',
        type: 'nestedArray',
        count: 5,
        fields: [
          { name: 'userId', type: 'number' },
          { name: 'rating', type: 'number' },
          { name: 'comment', type: 'text' },
          { name: 'date', type: 'date' }
        ]
      }
    ]
  },
  orders: {
    enabled: true,
    fields: [
      { name: 'id', type: 'number' },
      { name: 'userId', type: 'number' },
      { name: 'orderDate', type: 'date' },
      { name: 'status', type: 'text' },
      { name: 'totalAmount', type: 'price' },
      {
        name: 'shippingAddress',
        type: 'nested',
        fields: [
          { name: 'street', type: 'address' },
          { name: 'city', type: 'city' },
          { name: 'country', type: 'country' },
          { name: 'postalCode', type: 'text' }
        ]
      },
      {
        name: 'items',
        type: 'nestedArray',
        count: 3,
        fields: [
          { name: 'productId', type: 'number' },
          { name: 'quantity', type: 'number' },
          { name: 'unitPrice', type: 'price' },
          { name: 'subtotal', type: 'price' }
        ]
      }
    ]
  },
  blogPosts: {
    enabled: true,
    fields: [
      { name: 'id', type: 'number' },
      { name: 'title', type: 'text' },
      { name: 'slug', type: 'text' },
      { name: 'content', type: 'paragraph' },
      { name: 'excerpt', type: 'text' },
      { name: 'authorId', type: 'number' },
      { name: 'publishedAt', type: 'date' },
      { name: 'status', type: 'text' },
      {
        name: 'seo',
        type: 'nested',
        fields: [
          { name: 'metaTitle', type: 'text' },
          { name: 'metaDescription', type: 'text' },
          { name: 'keywords', type: 'array', count: 5, itemType: 'text' }
        ]
      },
      {
        name: 'tags',
        type: 'array',
        count: 4,
        itemType: 'text'
      }
    ]
  },
  numbers: {
    enabled: true,
    fields: [
      { name: 'id', type: 'numberAsc' },
      { name: 'randomNumber', type: 'numberRandom' },
      { name: 'descendingNumber', type: 'numberDesc' },
      { name: 'sha1', type: 'sha1' },
      { name: 'sha256', type: 'sha256' },
      { name: 'md5', type: 'md5' },
      { name: 'uuid', type: 'uuid' },
      { name: 'uuid4', type: 'uuid4' }
    ]
  },
  ascendingNumbers: {
    enabled: true,
    fields: [
      { name: 'number', type: 'numberAsc' }
    ]
  },
  descendingNumbers: {
    enabled: true,
    fields: [
      { name: 'number', type: 'numberDesc' }
    ]
  },
  randomNumbers: {
    enabled: true,
    fields: [
      { name: 'number', type: 'numberRandom' }
    ]
  },
  shaKeys: {
    enabled: true,
    fields: [
      { name: 'sha1', type: 'sha1' },
      { name: 'sha256', type: 'sha256' },
      { name: 'md5', type: 'md5' }
    ]
  },
  uuids: {
    enabled: true,
    fields: [
      { name: 'uuid', type: 'uuid' },
      { name: 'uuid4', type: 'uuid4' }
    ]
  },
  dates: {
    enabled: true,
    fields: [
      { name: 'date', type: 'date' }
    ]
  }
};

// Output configuration
const outputConfig = {
  directory: './fakegen',
  formats: ['json', 'csv', 'txt', 'yml', 'toml', 'xml']
};

// Media configurations
const mediaConfigs = {
  images: {
    enabled: true,
    count: 15,
    formats: ['jpg', 'png', 'webp'],
    aspectRatios: ['16:9', '4:3', '1:1', '3:2', '21:9', '2:1', '5:4'],
    baseSizes: [1, 16, 32, 64, 128, 256, 400, 512, 600, 800, 1024, 1200, 1600, 1920, 2048, 2560],
    generateSizes: true
  },
  favicons: {
    enabled: true,
    sizes: [16, 32, 48, 64, 128, 256, 512, 1024, 2048, 4096],
    formats: ['png', 'ico']
  },
  programmingCodes: {
    enabled: true,
    languages: ['cs', 'ps', 'php', 'js', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'dart'],
    count: 5
  },
  videos: {
    enabled: false,
    count: 5,
    duration: 3,
    width: 640,
    height: 480,
    formats: ['mp4', 'mov', 'mkv', 'mpg', 'mpeg', 'flv'],
    fps: 30
  },
  audio: {
    enabled: false,
    count: 5,
    duration: 10,
    sampleRate: 44100,
    formats: ['mp3', 'ogg', 'wav', 'webm', 'aac']
  }
};

// Default configuration
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

  // Validate media configurations
  const mediaTypes = ['images', 'favicons', 'programmingCodes', 'videos', 'audio'];
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
      const userConfig = yaml.load(configContent);

      if (userConfig && typeof userConfig === 'object') {
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
