/**
 * Convert data to CSV format
 * @param {Array<Object>} data - Data to convert
 * @returns {string} CSV formatted string
 */
function convertToCSV(data) {
  if (data.length === 0) return '';

  // Helper function to flatten nested objects
  function flattenObject(obj, prefix = '') {
    let flattened = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value)) {
        // For arrays, join with semicolons
        flattened[newKey] = value.map(item =>
          typeof item === 'object' ? JSON.stringify(item) : item
        ).join('; ');
      } else if (typeof value === 'object' && value !== null) {
        // Recursively flatten objects
        Object.assign(flattened, flattenObject(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    });
    return flattened;
  }

  // Flatten all data objects
  const flattenedData = data.map(item => flattenObject(item));
  const headers = Object.keys(flattenedData[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  flattenedData.forEach(item => {
    const values = headers.map(header => {
      const value = item[header];
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

/**
 * Convert data to TXT format
 * @param {Array<Object>} data - Data to convert
 * @returns {string} TXT formatted string
 */
function convertToTXT(data) {
  if (data.length === 0) return '';

  // Helper function to format nested objects
  function formatValue(value, indent = '') {
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      return value.map((item, i) =>
        `${indent}[${i}]: ${typeof item === 'object' ? '\n' + formatValue(item, indent + '  ') : item}`
      ).join('\n');
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([k, v]) =>
        `${indent}${k}: ${typeof v === 'object' ? '\n' + formatValue(v, indent + '  ') : v}`
      ).join('\n');
    }
    return String(value);
  }

  const lines = [];
  data.forEach((item, index) => {
    lines.push(`Record ${index + 1}:`);
    lines.push(`  ${'-'.repeat(20)}`);
    Object.entries(item).forEach(([key, value]) => {
      lines.push(`  ${key}: ${formatValue(value, '    ')}`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Convert data to YML format
 * @param {Array<Object>} data - Data to convert
 * @returns {string} YML formatted string
 */
function convertToYML(data) {
  if (data.length === 0) return '';

  const yaml = require('js-yaml');
  return yaml.dump(data, { indent: 2 });
}

/**
 * Convert data to TOML format
 * @param {Array<Object>} data - Data to convert
 * @returns {string} TOML formatted string
 */
function convertToTOML(data) {
  if (data.length === 0) return '';

  let tomlString = '';

  // Helper function to convert value to TOML format
  function valueToTOML(value, indent = '') {
    if (typeof value === 'string') {
      return `"${value.replace(/"/g, '\\"')}"`;
    } else if (typeof value === 'number') {
      return value.toString();
    } else if (typeof value === 'boolean') {
      return value.toString();
    } else if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const arrayItems = value.map(item => valueToTOML(item, indent + '  '));
      return `[\n${indent}  ${arrayItems.join(`,\n${indent}  `)}\n${indent}]`;
    } else if (typeof value === 'object' && value !== null) {
      let objStr = `{\n`;
      const entries = Object.entries(value);
      entries.forEach(([k, v], i) => {
        objStr += `${indent}  ${k} = ${valueToTOML(v, indent + '  ')}`;
        if (i < entries.length - 1) objStr += ',';
        objStr += '\n';
      });
      objStr += `${indent}}`;
      return objStr;
    }
    return `"${String(value)}"`;
  }

  // Generate TOML array of tables format
  data.forEach((item, index) => {
    if (index > 0) {
      tomlString += '\n';
    }
    tomlString += `[[records]]\n`;
    Object.entries(item).forEach(([key, value]) => {
      tomlString += `${key} = ${valueToTOML(value)}\n`;
    });
  });

  return tomlString;
}

/**
 * Convert data to XML format
 * @param {Array<Object>} data - Data to convert
 * @param {string} rootName - Root element name (default: 'records')
 * @returns {string} XML formatted string
 */
function convertToXML(data, rootName = 'records') {
  if (data.length === 0) return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}></${rootName}>`;

  // Helper function to convert value to XML-safe string
  function valueToXML(value, indent = '') {
    if (typeof value === 'string') {
      return value.replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '\'');
    } else if (typeof value === 'number') {
      return value.toString();
    } else if (typeof value === 'boolean') {
      return value.toString();
    } else if (Array.isArray(value)) {
      if (value.length === 0) return '';
      const arrayItems = value.map(item => {
        if (typeof item === 'object') {
          return `${indent}  <item>\n${objectToXML(item, indent + '    ')}${indent}  </item>`;
        } else {
          return `${indent}  <item>${valueToXML(item)}</item>`;
        }
      }).join('\n');
      return `\n${arrayItems}\n${indent}`;
    } else if (typeof value === 'object' && value !== null) {
      return `\n${objectToXML(value, indent + '  ')}${indent}`;
    }
    return valueToXML(String(value));
  }

  // Helper function to convert object to XML
  function objectToXML(obj, indent = '') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '';

    return entries.map(([key, value]) => {
      return `${indent}<${key}>${valueToXML(value, indent)}</${key}>`;
    }).join('\n');
  }

  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;

  data.forEach((item, index) => {
    xmlString += `  <record id="${index + 1}">\n`;
    xmlString += objectToXML(item, '    ');
    xmlString += '\n  </record>\n';
  });

  xmlString += `</${rootName}>`;
  return xmlString;
}

module.exports = {
  convertToCSV,
  convertToTXT,
  convertToYML,
  convertToTOML,
  convertToXML
};
