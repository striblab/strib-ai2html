/**
 * Sub command for generate
 */

// Dependencies
const os = require('os');
const { generate } = require('../../lib/generate.js');
const debug = require('debug')('strib-ai2html:command:generate');

// Describe command use
exports.command = 'generate';

// Description
exports.describe = 'Generate AI plugin script.';

// Options
exports.builder = yargs => {
  yargs.options('platform', {
    describe:
      'Generate for a specific platform, will determine automatically by default.',
    type: 'string',
    default: os.platform()
  });

  yargs.options('ai2html-version', {
    describe: 'Version of ai2html to use as base.',
    type: 'string',
    default: 'v0.77.0'
  });

  return yargs;
};

// Main function
exports.handler = async argv => {
  // TODO
  await generate(argv);
};
