/**
 * Sub command for font stuff
 */

// Dependencies
const os = require('os');
const _ = require('lodash');
const { fonts } = require('../../lib/fonts.js');
require('console.table');
const debug = require('debug')('strib-ai2html:command:fonts');

// Describe command use
exports.command = 'fonts';

// Description
exports.describe = 'Font related actions.';

// Options
exports.builder = yargs => {
  yargs.options('list', {
    describe: 'List all currently install fonts.',
    type: 'boolean',
    default: false
  });
  yargs.options('check', {
    describe: 'Check for Strib web fonts.',
    type: 'boolean',
    default: false
  });

  return yargs;
};

// Fonts
exports.handler = async argv => {
  let f = fonts(argv);

  // List
  if (argv.list) {
    try {
      f.getInstalledFonts();
      console.table(
        _.sortBy(
          f.fonts.map(font => {
            return { name: font.postscriptName, path: font.path };
          }),
          'name'
        )
      );
      console.error(`\nFound ${f.fonts.length} fonts.`);
    }
    catch (e) {
      console.error(e);
      console.error('Error getting fonts.');
    }
  }

  // Check
  if (argv.check) {
    try {
      let checked = await f.checkFonts();
      console.table(
        checked.map(set => {
          return {
            name: set.name,
            found: set.found === false ? 'x' : '✓',
            'fonts found': set.found
              ? _.map(set.found, 'postscriptName').join(', ')
              : ''
          };
        })
      );
    }
    catch (e) {
      console.error(e);
      console.error('Error checking fonts.');
    }
  }
};
