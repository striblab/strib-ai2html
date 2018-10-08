/**
 * Sub command for font stuff
 */

// Dependencies
const { CLIOutput } = require('../../lib/cli-output.js');
const install = require('../../lib/install.js');
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

  return yargs;
};

// Fonts
exports.handler = async argv => {
  let output = new CLIOutput();
  output.intro('Install');

  // Check build file
  if (!install.hasBuildFile()) {
    output.exit(
      'Unable to find the generated file, try running `strib-ai2html generate` first.'
    );
  }

  // Try to find an install place
  let installPaths = install.findPaths();
  if (!installPaths || !installPaths[0]) {
    output.exit(
      'Unable to find a place to install script, make sure Illustrator is installed, or use --install option.'
    );
  }

  // Check if writable
  if (!install.canWrite(installPaths[0])) {
    output.exit(
      `Unable to write script to following location, maybe you have to be an administrator (and possibly use "sudo"): \n ${
        installPaths[0]
      }`
    );
  }

  // Install
  install.install(installPaths[0]);

  output.done();
};
