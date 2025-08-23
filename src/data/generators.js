const { faker } = require('@faker-js/faker');
const crypto = require('crypto');

// Counter state management using closures instead of global variables
const counterState = {
  ascCounter: 1,
  descCounter: 1000
};

/**
 * Get next ascending number
 * @returns {number} Next ascending number
 */
function getNextAscNumber() {
  return counterState.ascCounter++;
}

/**
 * Get next descending number
 * @returns {number} Next descending number
 */
function getNextDescNumber() {
  return counterState.descCounter--;
}

/**
 * Reset counters to initial state
 */
function resetCounters() {
  counterState.ascCounter = 1;
  counterState.descCounter = 1000;
}

/**
 * Validate field configuration
 * @param {Object} fieldConfig - Field configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateFieldConfig(fieldConfig = {}) {
  if (fieldConfig.count !== undefined && (typeof fieldConfig.count !== 'number' || fieldConfig.count < 1)) {
    throw new Error('Field count must be a positive number');
  }

  if (fieldConfig.fields !== undefined && !Array.isArray(fieldConfig.fields)) {
    throw new Error('Fields must be an array');
  }
}

/**
 * Generate fake data based on field type
 * @param {string} type - Field type
 * @param {Object} fieldConfig - Field configuration (for nested types)
 * @returns {any} Generated fake data
 * @throws {Error} If type is unknown or configuration is invalid
 */
function generateFakeDataForField(type, fieldConfig = {}) {
  validateFieldConfig(fieldConfig);

  switch (type) {
    case 'number':
      return faker.number.int({ min: 1, max: 1000 });
    case 'number-ascending':
    case 'numberAsc':
      return getNextAscNumber();
    case 'number-descending':
    case 'numberDesc':
      return getNextDescNumber();
    case 'number-random':
    case 'numberRandom':
      return faker.number.int({ min: 1, max: 10000 });
    case 'sha1':
      return crypto.createHash('sha1').update(faker.lorem.word()).digest('hex');
    case 'sha256':
      return crypto.createHash('sha256').update(faker.lorem.sentence()).digest('hex');
    case 'md5':
      return crypto.createHash('md5').update(faker.internet.email()).digest('hex');
    case 'uuid':
      return faker.string.uuid();
    case 'uuid4':
      return crypto.randomUUID();
    case 'first-name':
    case 'firstName':
      return faker.person.firstName();
    case 'last-name':
    case 'lastName':
      return faker.person.lastName();
    case 'full-name':
    case 'fullName':
      return faker.person.fullName();
    case 'email':
      return faker.internet.email();
    case 'phone-number':
    case 'phoneNumber':
      return faker.phone.number();
    case 'address':
      return faker.location.streetAddress();
    case 'city':
      return faker.location.city();
    case 'country':
      return faker.location.country();
    case 'company-name':
    case 'companyName':
      return faker.company.name();
    case 'product-name':
    case 'productName':
      return faker.commerce.productName();
    case 'product-description':
    case 'productDescription':
      return faker.commerce.productDescription();
    case 'price':
      return parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
    case 'product-category':
    case 'productCategory':
      return faker.commerce.department();
    case 'boolean':
      return faker.datatype.boolean();
    case 'date':
      return faker.date.recent().toISOString();
    case 'text':
      return faker.lorem.sentence();
    case 'paragraph':
      return faker.lorem.paragraph();
    case 'nested':
      // Generate nested object
      const nestedObj = {};
      if (fieldConfig.fields) {
        fieldConfig.fields.forEach(nestedField => {
          nestedObj[nestedField.name] = generateFakeDataForField(nestedField.type, nestedField);
        });
      }
      return nestedObj;
    case 'nested-array':
    case 'nestedArray':
      // Generate array of nested objects
      const nestedArray = [];
      const count = fieldConfig.count || 2;
      for (let i = 0; i < count; i++) {
        const nestedItem = {};
        if (fieldConfig.fields) {
          fieldConfig.fields.forEach(nestedField => {
            nestedItem[nestedField.name] = generateFakeDataForField(nestedField.type, nestedField);
          });
        }
        nestedArray.push(nestedItem);
      }
      return nestedArray;
    case 'array':
      // Generate simple array
      const array = [];
      const arrayCount = fieldConfig.count || 3;
      const itemType = fieldConfig.itemType || 'text';
      for (let i = 0; i < arrayCount; i++) {
        array.push(generateFakeDataForField(itemType));
      }
      return array;
    default:
      // For unknown types, try to use faker directly or return a default word
      try {
        if (faker[type]) {
          return faker[type]();
        }
      } catch (error) {
        console.warn(`Unknown field type: ${type}, using default value`);
      }
      return faker.lorem.word();
  }
}

/**
 * Validate type configuration
 * @param {Object} typeConfig - Configuration for the data type
 * @param {number} count - Number of records to generate
 * @throws {Error} If configuration is invalid
 */
function validateTypeConfig(typeConfig, count) {
  if (!typeConfig) {
    throw new Error('Type configuration is required');
  }

  if (!typeConfig.fields || !Array.isArray(typeConfig.fields)) {
    throw new Error('Type configuration must have a fields array');
  }

  if (typeof count !== 'number' || count < 1) {
    throw new Error('Count must be a positive number');
  }
}

/**
 * Generate data for a specific type
 * @param {Object} typeConfig - Configuration for the data type
 * @param {number} count - Number of records to generate
 * @returns {Array<Object>} Generated data array
 * @throws {Error} If configuration is invalid
 */
function generateDataForType(typeConfig, count) {
  validateTypeConfig(typeConfig, count);

  const data = [];
  for (let i = 0; i < count; i++) {
    const item = {};
    typeConfig.fields.forEach(field => {
      try {
        item[field.name] = generateFakeDataForField(field.type, field);
      } catch (error) {
        console.error(`Error generating field ${field.name}:`, error.message);
        item[field.name] = null; // Set null for failed fields
      }
    });
    data.push(item);
  }
  return data;
}

module.exports = {
  generateFakeDataForField,
  generateDataForType,
  resetCounters,
  getNextAscNumber,
  getNextDescNumber
};
