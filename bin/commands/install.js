/**
 * Sub command for font stuff
 */

// Dependencies
const { CLIOutput } = require('../../lib/cli-output.js');
const { Install } = require('../../lib/install.js');
const errors = require('../../lib/errors.js');
const debug = require('debug')('strib-ai2html:command:install');

// Describe command use
exports.command = 'install';

// Description
exports.describe = 'Install the script.';

// Options
exports.builder = yargs => {
  yargs.options('overwrite', {
    describe: 'Overwrite existing file if one is there.',
    type: 'boolean',
    default: false
  });

  yargs.options('ai2html-version', {
    describe:
      'Version of ai2html to use as base.  Overall, this should not be changed, as different versions may cause the script to break.',
    type: 'string',
    default: 'v0.81.4'
  });

  yargs.options('font-check', {
    describe:
      'Check for font or not.  Do not skip font check unless you know what you are doing.',
    type: 'boolean',
    default: true
  });

  yargs.options('illustrator-scripts', {
    describe:
      'Illustrator script directory where strib-ai2html.js gets installed.  If not provided, will try to automatlly figure it out.',
    type: 'path'
  });

  yargs.options('illustrator-templates', {
    describe:
      'Illustrator template directory where strib-ai2html templates gets installed.  If not provided, will try to automatlly figure it out.',
    type: 'path'
  });

  return yargs;
};

// Fonts
async function main(argv, noTitle = false) {
  // Setupt output
  let output = new CLIOutput();
  if (!noTitle) {
    output.intro('Install');
  }

  // Install
  let i = new Install(argv);

  // Try to compile, including font-check
  try {
    await i.compile();
  }
  catch (e) {
    // Handle font check error
    if (e.id === errors.fontCheck) {
      let fontIssues = _.map(_.filter(e.data, set => !set.found), 'name').join(
        ', '
      );

      output.error(`${e.message}
        Unable to find the following fonts: ${fontIssues}`);

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

          output.exit('Did not install ai2html.');
        });
    }
    else {
      output.error(e);
      output.exit('Did not install ai2html.');
    }
  }

  // Install (move files);
  try {
    let { templates, scripts } = await i.install();
    output.out(`Scripts written: \n${scripts.join('\n')}`);
    output.out(`Templates written: \n${templates.join('\n')}`);
  }
  catch (e) {
    output.error(e);
    output.exit('Did not install ai2html.');
  }

  output.done();
}

exports.handler = main;
