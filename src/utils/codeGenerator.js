const fs = require('fs-extra');
const path = require('path');
const { faker } = require('@faker-js/faker');

/**
 * Generate example code for different programming languages
 * @param {string} language - Programming language
 * @returns {string} Generated code example
 */
function generateCodeExample(language) {
  const functionName = faker.lorem.word();
  const className = faker.lorem.word().charAt(0).toUpperCase() + faker.lorem.word().slice(1);
  const variableName = faker.lorem.word();
  const message = faker.lorem.sentence();

  switch (language.toLowerCase()) {
    case 'cs':
      return `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("${message}");
            Console.ReadLine();
        }
    }
}`;

    case 'ps':
      return `Write-Host "${message}"
Read-Host "Press Enter to continue"`;

    case 'php':
      return `<?php
echo "${message}\\n";
?>`;

    case 'js':
      return `function ${functionName}() {
    console.log("${message}");
}

${functionName}();`;

    case 'ts':
      return `function ${functionName}(): void {
    console.log("${message}");
}

${functionName}();`;

    case 'tsx':
      return `import React from 'react';

interface ${className}Props {
    message: string;
}

const ${className}: React.FC<${className}Props> = ({ message }) => {
    return <div>{message}</div>;
};

export default ${className};`;

    case 'py':
      return `def ${functionName}():
    print("${message}")

if __name__ == "__main__":
    ${functionName}()`;

    case 'java':
      return `public class ${className} {
    public static void main(String[] args) {
        System.out.println("${message}");
    }
}`;

    case 'cpp':
      return `#include <iostream>

int main() {
    std::cout << "${message}" << std::endl;
    return 0;
}`;

    case 'c':
      return `#include <stdio.h>

int main() {
    printf("${message}\\n");
    return 0;
}`;

    case 'rb':
      return `def ${functionName}
    puts "${message}"
end

${functionName}`;

    case 'go':
      return `package main

import "fmt"

func main() {
    fmt.Println("${message}")
}`;

    case 'rs':
      return `fn main() {
    println!("${message}");
}`;

    case 'swift':
      return `import Foundation

func ${functionName}() {
    print("${message}")
}

${functionName}()`;

    case 'kt':
      return `fun main() {
    println("${message}")
}`;

    case 'scala':
      return `object ${className} {
    def main(args: Array[String]): Unit = {
        println("${message}")
    }
}`;

    case 'dart':
      return `void main() {
    print('${message}');
}`;

    default:
      return `// Example code for ${language}
console.log("${message}");`;
  }
}

/**
 * Generate programming code files for all specified languages
 * @param {Object} config - Configuration object
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function generateProgrammingCodes(config, outputDir) {
  // Support both kebab-case and camelCase configuration keys
  const programmingConfig = config['programming-codes'] || config.programmingCodes;
  
  if (!programmingConfig || !programmingConfig.enabled) {
    console.log('Programming codes generation is disabled');
    return;
  }

  // Validate configuration
  if (!programmingConfig.languages || !Array.isArray(programmingConfig.languages)) {
    console.warn('No programming languages configured, skipping code generation');
    return;
  }

  if (programmingConfig.languages.length === 0) {
    console.warn('Empty programming languages array, skipping code generation');
    return;
  }

  console.log('Generating programming code examples...');
  const codeDir = path.join(outputDir, 'programming-code');
  await fs.ensureDir(codeDir);

  const count = programmingConfig.count || 5;

  for (const language of programmingConfig.languages) {
    try {
      for (let i = 0; i < count; i++) {
        const code = generateCodeExample(language);
        const filename = `hello_${i + 1}`;
        const extension = getFileExtension(language);
        const filepath = path.join(codeDir, `${filename}.${extension}`);

        await fs.writeFile(filepath, code);
        console.log(`Generated ${language.toUpperCase()} code: ${filepath}`);
      }
    } catch (error) {
      console.error(`Error generating ${language} code:`, error.message);
    }
  }

  console.log('Programming code generation completed!');
}

/**
 * Get file extension for a programming language
 * @param {string} language - Programming language
 * @returns {string} File extension
 */
function getFileExtension(language) {
  const extensions = {
    'cs': 'cs',
    'ps': 'ps1',
    'php': 'php',
    'js': 'js',
    'ts': 'ts',
    'tsx': 'tsx',
    'py': 'py',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'rb': 'rb',
    'go': 'go',
    'rs': 'rs',
    'swift': 'swift',
    'kt': 'kt',
    'scala': 'scala',
    'dart': 'dart'
  };

  return extensions[language.toLowerCase()] || 'txt';
}

/**
 * Validate programming configuration
 * @param {Object} config - Programming configuration object
 * @throws {Error} If configuration is invalid
 */
function validateProgrammingConfig(config) {
  const required = ['enabled', 'languages', 'count'];
  const missing = required.filter(key => !(key in config));
  
  if (missing.length > 0) {
    throw new Error(`Programming config missing required fields: ${missing.join(', ')}`);
  }
  
  if (!Array.isArray(config.languages)) {
    throw new Error('Programming config languages must be an array');
  }
  
  if (typeof config.count !== 'number' || config.count < 1) {
    throw new Error('Programming config count must be a positive number');
  }
}

module.exports = {
  generateCodeExample,
  generateProgrammingCodes,
  getFileExtension,
  validateProgrammingConfig
};
