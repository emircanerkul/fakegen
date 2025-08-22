#!/usr/bin/env node

const { Command } = require('commander');
const { loadConfig, createDefaultConfig } = require('../src/config');
const { generateFakeData } = require('../src/generator');

const program = new Command();

// CLI setup
program
  .name('fakegen')
  .description('Generate fake data and images using faker')
  .version('1.0.0')
  .option('-c, --config <path>', 'path to config file', '.fakegen.yml')
  .option('-o, --output <directory>', 'output directory', './fakegen')
  .option('-n, --count <number>', 'number of records to generate', '10')
  .action(async (options) => {
    try {
      const config = await loadConfig();

      // Override config with CLI options
      if (options.output !== './fakegen') {
        config.output.directory = options.output;
      }
      if (options.count !== '10') {
        config.data.count = parseInt(options.count);
      }

      await generateFakeData(config);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Add init command to create default config
program
  .command('init')
  .description('Create a default .fakegen.yml configuration file')
  .action(async () => {
    try {
      await createDefaultConfig();
    } catch (error) {
      console.error('Error creating config file:', error.message);
      process.exit(1);
    }
  });

program.parse();
