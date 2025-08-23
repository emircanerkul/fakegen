const fs = require('fs-extra');
const path = require('path');
const { convertToCSV, convertToTXT, convertToYML, convertToTOML, convertToXML } = require('../data');
const { isSimpleDataType } = require('../config/data-types');

/**
 * Save data to different formats with kebab-case directory structure
 * @param {Array<Object>} data - Data to save
 * @param {string} typeName - Name of the data type
 * @param {string} outputDir - Output directory
 * @param {Array<string>} formats - Array of formats to save
 * @returns {Promise<void>}
 */
async function saveDataToFormats(data, typeName, outputDir, formats) {
  // Create kebab-case directory name
  const kebabTypeName = typeName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  
  // Organize in data subdirectory
  const dataDir = path.join(outputDir, 'data');
  const typeDir = path.join(dataDir, kebabTypeName);

  for (const format of formats) {
    const formatDir = path.join(typeDir, format);
    await fs.ensureDir(formatDir);

    const filename = `${typeName}.${format}`;
    const filepath = path.join(formatDir, filename);

    switch (format) {
      case 'json':
        // For simple data types, save as simple array of values
        if (isSimpleDataType(typeName)) {
          const simpleArray = data.map(item => {
            const firstField = Object.keys(item)[0];
            return item[firstField];
          });
          await fs.writeJson(filepath, simpleArray, { spaces: 2 });
        } else {
          await fs.writeJson(filepath, data, { spaces: 2 });
        }
        break;
      case 'csv':
        const csvContent = convertToCSV(data, typeName);
        await fs.writeFile(filepath, csvContent);
        break;
      case 'txt':
        const txtContent = convertToTXT(data, typeName);
        await fs.writeFile(filepath, txtContent);
        break;
      case 'yml':
      case 'yaml':
        const ymlContent = convertToYML(data, typeName);
        await fs.writeFile(filepath, ymlContent);
        break;
      case 'toml':
        const tomlContent = convertToTOML(data, typeName);
        await fs.writeFile(filepath, tomlContent);
        break;
      case 'xml':
        const xmlContent = convertToXML(data, 'records', typeName);
        await fs.writeFile(filepath, xmlContent);
        break;
    }
    console.log(`Generated ${format.toUpperCase()} file: ${filepath}`);
  }
}

module.exports = {
  saveDataToFormats
};
