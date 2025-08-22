const fs = require('fs-extra');
const path = require('path');
const { convertToCSV, convertToTXT, convertToYML, convertToTOML, convertToXML } = require('../data');

/**
 * Save data to different formats
 * @param {Array<Object>} data - Data to save
 * @param {string} typeName - Name of the data type
 * @param {string} outputDir - Output directory
 * @param {Array<string>} formats - Array of formats to save
 * @returns {Promise<void>}
 */
async function saveDataToFormats(data, typeName, outputDir, formats) {
  const typeDir = path.join(outputDir, typeName);

  for (const format of formats) {
    const formatDir = path.join(typeDir, format);
    await fs.ensureDir(formatDir);

    const filename = `${typeName}.${format}`;
    const filepath = path.join(formatDir, filename);

    switch (format) {
      case 'json':
        await fs.writeJson(filepath, data, { spaces: 2 });
        break;
      case 'csv':
        const csvContent = convertToCSV(data);
        await fs.writeFile(filepath, csvContent);
        break;
      case 'txt':
        const txtContent = convertToTXT(data);
        await fs.writeFile(filepath, txtContent);
        break;
      case 'yml':
      case 'yaml':
        const ymlContent = convertToYML(data);
        await fs.writeFile(filepath, ymlContent);
        break;
      case 'toml':
        const tomlContent = convertToTOML(data);
        await fs.writeFile(filepath, tomlContent);
        break;
      case 'xml':
        const xmlContent = convertToXML(data);
        await fs.writeFile(filepath, xmlContent);
        break;
    }
    console.log(`Generated ${format.toUpperCase()} file: ${filepath}`);
  }
}

module.exports = {
  saveDataToFormats
};
