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
      'Unable to find the generated build file, try running `strib-ai2html generate` first.'
    );
  }

  // Try to find an install place
  let installScriptPaths = install.findGlobsPaths(install.installScriptGlobs);
  if (!installScriptPaths || !installScriptPaths[0]) {
    output.exit(
      'Unable to find a place to install script, make sure Illustrator is installed.'
    );
  }

  // Check if writable
  if (!install.canWrite(installScriptPaths[0])) {
    output.exit(
      `Unable to write script to following location, maybe you have to be an administrator (and possibly use "sudo"): \n ${
        installScriptPaths[0]
      }`
    );
  }

  // Install
  install.installScript(installScriptPaths[0]);
  output.out(`Installed ai2html script in: ${installScriptPaths[0]}`);

  // Try to find template place
  let installTemplatePaths = install.findGlobsPaths(
    install.installTemplateGlobs
  );
  if (!installTemplatePaths || !installTemplatePaths[0]) {
    output.exit(
      'Unable to find a place to install templates, make sure Illustrator is installed.'
    );
  }

  // Check if writable
  if (!install.canWrite(installTemplatePaths[0])) {
    output.exit(
      `Unable to write templates to following location, maybe you have to be an administrator (and possibly use "sudo"): \n ${
        installTemplatePaths[0]
      }`
    );
  }

  // Install
  let t = install.installTemplates(installTemplatePaths[0]);
  output.out(
    `Installed ${t.length} template(s) in: ${installTemplatePaths[0]}`
  );

  output.done();
};
