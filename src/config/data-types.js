/**
 * Data type configurations with kebab-case naming
 * Organized by complexity: simple types vs complex types
 */

// Simple data types - generate minimal formatted output
const SIMPLE_DATA_TYPES = {
  'simple-numbers': {
    enabled: true,
    description: 'Simple ascending numbers',
    fields: [
      { name: 'number', type: 'number-ascending' }
    ]
  },
  'random-numbers': {
    enabled: true,
    description: 'Random numbers within range',
    fields: [
      { name: 'number', type: 'number-random' }
    ]
  },
  'descending-numbers': {
    enabled: true,
    description: 'Descending number sequence',
    fields: [
      { name: 'number', type: 'number-descending' }
    ]
  },
  'crypto-hashes': {
    enabled: true,
    description: 'Cryptographic hash values',
    fields: [
      { name: 'sha256-hash', type: 'sha256' },
      { name: 'md5-hash', type: 'md5' },
      { name: 'sha1-hash', type: 'sha1' }
    ]
  },
  'uuid-sequences': {
    enabled: true,
    description: 'UUID identifier sequences',
    fields: [
      { name: 'uuid', type: 'uuid' },
      { name: 'uuid4', type: 'uuid4' }
    ]
  },
  'date-sequences': {
    enabled: true,
    description: 'Date sequences for testing',
    fields: [
      { name: 'date', type: 'date' }
    ]
  }
};

// Complex data types - full record structure with nested objects
const COMPLEX_DATA_TYPES = {
  'user-profiles': {
    enabled: true,
    description: 'Complete user profile data with nested information',
    fields: [
      { name: 'user-id', type: 'number-ascending' },
      { name: 'first-name', type: 'first-name' },
      { name: 'last-name', type: 'last-name' },
      { name: 'email-address', type: 'email' },
      { name: 'phone-number', type: 'phone-number' },
      { name: 'street-address', type: 'address' },
      { name: 'company-name', type: 'company-name' },
      {
        name: 'user-profile',
        type: 'nested',
        fields: [
          { name: 'bio-text', type: 'paragraph' },
          { name: 'avatar-url', type: 'text' },
          {
            name: 'social-links', 
            type: 'nested-array', 
            count: 3, 
            fields: [
              { name: 'platform-name', type: 'text' },
              { name: 'profile-url', type: 'text' }
            ]
          }
        ]
      }
    ]
  },
  'product-catalog': {
    enabled: true,
    description: 'E-commerce product data with specifications and reviews',
    fields: [
      { name: 'product-id', type: 'number-ascending' },
      { name: 'product-name', type: 'product-name' },
      { name: 'product-description', type: 'product-description' },
      { name: 'unit-price', type: 'price' },
      { name: 'product-category', type: 'product-category' },
      { name: 'in-stock', type: 'boolean' },
      {
        name: 'product-specifications',
        type: 'nested',
        fields: [
          { name: 'item-weight', type: 'number' },
          {
            name: 'item-dimensions', 
            type: 'nested', 
            fields: [
              { name: 'width-cm', type: 'number' },
              { name: 'height-cm', type: 'number' },
              { name: 'depth-cm', type: 'number' }
            ]
          },
          { name: 'material-list', type: 'array', count: 3, itemType: 'text' }
        ]
      },
      {
        name: 'customer-reviews',
        type: 'nested-array',
        count: 5,
        fields: [
          { name: 'reviewer-id', type: 'number' },
          { name: 'star-rating', type: 'number' },
          { name: 'review-comment', type: 'text' },
          { name: 'review-date', type: 'date' }
        ]
      }
    ]
  },
  'order-history': {
    enabled: true,
    description: 'Order transaction data with shipping and line items',
    fields: [
      { name: 'order-id', type: 'number-ascending' },
      { name: 'customer-id', type: 'number' },
      { name: 'order-date', type: 'date' },
      { name: 'order-status', type: 'text' },
      { name: 'total-amount', type: 'price' },
      {
        name: 'shipping-address',
        type: 'nested',
        fields: [
          { name: 'street-address', type: 'address' },
          { name: 'city-name', type: 'city' },
          { name: 'country-name', type: 'country' },
          { name: 'postal-code', type: 'text' }
        ]
      },
      {
        name: 'order-items',
        type: 'nested-array',
        count: 3,
        fields: [
          { name: 'product-id', type: 'number' },
          { name: 'item-quantity', type: 'number' },
          { name: 'unit-price', type: 'price' },
          { name: 'line-subtotal', type: 'price' }
        ]
      }
    ]
  },
  'blog-posts': {
    enabled: true,
    description: 'Blog content with SEO metadata and categorization',
    fields: [
      { name: 'post-id', type: 'number-ascending' },
      { name: 'post-title', type: 'text' },
      { name: 'url-slug', type: 'text' },
      { name: 'post-content', type: 'paragraph' },
      { name: 'post-excerpt', type: 'text' },
      { name: 'author-id', type: 'number' },
      { name: 'published-at', type: 'date' },
      { name: 'post-status', type: 'text' },
      {
        name: 'seo-metadata',
        type: 'nested',
        fields: [
          { name: 'meta-title', type: 'text' },
          { name: 'meta-description', type: 'text' },
          { name: 'seo-keywords', type: 'array', count: 5, itemType: 'text' }
        ]
      },
      {
        name: 'post-tags',
        type: 'array',
        count: 4,
        itemType: 'text'
      }
    ]
  }
};

/**
 * Get all data types (simple and complex)
 * @returns {Object} All data type configurations
 */
function getAllDataTypes() {
  return {
    ...SIMPLE_DATA_TYPES,
    ...COMPLEX_DATA_TYPES
  };
}

/**
 * Get simple data types only
 * @returns {Object} Simple data type configurations
 */
function getSimpleDataTypes() {
  return SIMPLE_DATA_TYPES;
}

/**
 * Get complex data types only
 * @returns {Object} Complex data type configurations
 */
function getComplexDataTypes() {
  return COMPLEX_DATA_TYPES;
}

/**
 * Check if a data type is simple (single field, minimal formatting)
 * @param {string} typeName - Data type name
 * @returns {boolean} True if the type is simple
 */
function isSimpleDataType(typeName) {
  return !!SIMPLE_DATA_TYPES[typeName];
}

/**
 * Check if a data type is complex (multiple fields, full record structure)
 * @param {string} typeName - Data type name
 * @returns {boolean} True if the type is complex
 */
function isComplexDataType(typeName) {
  return !!COMPLEX_DATA_TYPES[typeName];
}

/**
 * Get data type by name
 * @param {string} typeName - Data type name
 * @returns {Object|null} Data type configuration or null if not found
 */
function getDataType(typeName) {
  return getAllDataTypes()[typeName] || null;
}

/**
 * Get enabled data types only
 * @returns {Object} Enabled data type configurations
 */
function getEnabledDataTypes() {
  const allTypes = getAllDataTypes();
  const enabled = {};
  
  Object.entries(allTypes).forEach(([name, config]) => {
    if (config.enabled) {
      enabled[name] = config;
    }
  });
  
  return enabled;
}



module.exports = {
  SIMPLE_DATA_TYPES,
  COMPLEX_DATA_TYPES,
  getAllDataTypes,
  getSimpleDataTypes,
  getComplexDataTypes,
  isSimpleDataType,
  isComplexDataType,
  getDataType,
  getEnabledDataTypes
};