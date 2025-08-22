const { faker } = require('@faker-js/faker');

/**
 * Generate fake data based on field type
 * @param {string} type - Field type
 * @param {Object} fieldConfig - Field configuration (for nested types)
 * @returns {any} Generated fake data
 */
function generateFakeDataForField(type, fieldConfig = {}) {
  switch (type) {
    case 'number':
      return faker.number.int({ min: 1, max: 1000 });
    case 'firstName':
      return faker.person.firstName();
    case 'lastName':
      return faker.person.lastName();
    case 'fullName':
      return faker.person.fullName();
    case 'email':
      return faker.internet.email();
    case 'phoneNumber':
      return faker.phone.number();
    case 'address':
      return faker.location.streetAddress();
    case 'city':
      return faker.location.city();
    case 'country':
      return faker.location.country();
    case 'companyName':
      return faker.company.name();
    case 'productName':
      return faker.commerce.productName();
    case 'productDescription':
      return faker.commerce.productDescription();
    case 'price':
      return parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
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
    case 'numberAsc':
      // Ascending numbers
      if (!global.ascCounter) global.ascCounter = 1;
      return global.ascCounter++;
    case 'numberDesc':
      // Descending numbers
      if (!global.descCounter) global.descCounter = 1000;
      return global.descCounter--;
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
    default:
      return faker.lorem.word();
  }
}

/**
 * Generate data for a specific type
 * @param {Object} typeConfig - Configuration for the data type
 * @param {number} count - Number of records to generate
 * @returns {Array<Object>} Generated data array
 */
function generateDataForType(typeConfig, count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const item = {};
    typeConfig.fields.forEach(field => {
      item[field.name] = generateFakeDataForField(field.type, field);
    });
    data.push(item);
  }
  return data;
}

module.exports = {
  generateFakeDataForField,
  generateDataForType
};
