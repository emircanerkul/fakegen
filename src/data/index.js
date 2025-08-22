const { generateFakeDataForField, generateDataForType } = require('./generators');
const { convertToCSV, convertToTXT, convertToYML, convertToTOML, convertToXML } = require('./formatters');

module.exports = {
  generateFakeDataForField,
  generateDataForType,
  convertToCSV,
  convertToTXT,
  convertToYML,
  convertToTOML,
  convertToXML
};
