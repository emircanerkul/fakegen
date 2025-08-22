const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

// Default configuration
const defaultConfig = {
  output: {
    directory: './fakegen',
    formats: ['json', 'csv', 'txt', 'yml', 'toml', 'xml']
  },
  data: {
    count: 10,
    types: {
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
      }
    }
  },
  images: {
    enabled: true,
    count: 15,
    formats: ['jpg', 'png'],
    aspectRatios: ['16:9', '4:3', '1:1', '3:2', '21:9', '2:1', '5:4'],
    baseSizes: [1, 16, 32, 64, 128, 256, 400, 512, 600, 800, 1024, 1200, 1600, 1920, 2048, 2560],
    generateSizes: true
  }
};

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
        return { ...defaultConfig, ...userConfig };
      } else {
        console.warn('Warning: Invalid configuration file format, using defaults');
      }
    }
  } catch (error) {
    console.warn('Warning: Could not load configuration file, using defaults');
  }
  return defaultConfig;
}

/**
 * Create default configuration file
 * @returns {Promise<void>}
 */
async function createDefaultConfig() {
  const configPath = path.join(process.cwd(), '.fakegen.yml');
  if (await fs.pathExists(configPath)) {
    console.log('.fakegen.yml already exists!');
    return;
  }

  await fs.writeFile(configPath, yaml.dump(defaultConfig));
  console.log('Created .fakegen.yml configuration file');
}

module.exports = {
  loadConfig,
  createDefaultConfig,
  defaultConfig
};
