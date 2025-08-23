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
  if (!config.programmingCodes || !config.programmingCodes.enabled) {
    return;
  }

  console.log('Generating programming code examples...');
  const codeDir = path.join(outputDir, 'programming-code');
  await fs.ensureDir(codeDir);

  const count = config.programmingCodes.count || 5;

  for (const language of config.programmingCodes.languages) {
    for (let i = 0; i < count; i++) {
      const code = generateCodeExample(language);
      const filename = `hello_${i + 1}`;
      const extension = getFileExtension(language);
      const filepath = path.join(codeDir, `${filename}.${extension}`);

      await fs.writeFile(filepath, code);
      console.log(`Generated ${language.toUpperCase()} code: ${filepath}`);
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

module.exports = {
  generateCodeExample,
  generateProgrammingCodes,
  getFileExtension
};
