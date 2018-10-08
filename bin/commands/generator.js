/**
 * Sub command for generate
 */

// Dependencies
const os = require('os');
const inquirer = require('inquirer');
const _ = require('lodash');
const errors = require('../../lib/errors.js');
const { CLIOutput } = require('../../lib/cli-output.js');
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

  yargs.options('font-check', {
    describe:
      'Check for font or not.  Do not skip font check unless you know what you are doing.',
    type: 'boolean',
    default: true
  });

  return yargs;
};

// Main function
async function main(argv, noTitle = false) {
  // Setupt output
  let output = new CLIOutput();
  if (!noTitle) {
    output.intro('Generate');
  }

  try {
    output.out('Generating ...');
    let { outputPath } = await generate(argv);
    output.out(
      `Created script file in the following location: \n ${outputPath}`
    );
    output.done();
  }
  catch (e) {
    // Handle font check error
    if (e.id === errors.fontCheck) {
      output.error(`${e.message}
        Unable to find the following fonts: ${_.map(
    _.filter(e.data, set => !set.found),
    'name'
  ).join(', ')}`);

      // Prompt to override
      return inquirer
        .prompt({
          name: 'skipFontCheck',
          message: `${
            output.indent
          }Do you wish to continue anyway?  This may lead to fonts not exported correctly when using ai2html`,
          type: 'confirm',
          default: false
        })
        .then(answers => {
          if (answers.skipFontCheck) {
            argv.fontCheck = false;
            return main(argv, true);
          }

          output.exit('Did not generate ai2html.');
        });
    }

    output.error(e);
    output.exit('Did not generate ai2html.');
  }
}

exports.handler = main;
