/**
 * Methods for install
 */

// Dependencies
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const debug = require('debug')('strib-ai2html:install');

// Script name
const scriptName = 'strib-ai2html.js';

// Build location
const buildDir = path.join(__dirname, '..', 'build');
const buildPath = path.join(buildDir, scriptName);

// Possible install locations
const installGlobs = [
  path.join(
    'C:',
    'Program Files',
    'Adobe',
    'Adobe Illustrator*',
    'Presets',
    '**',
    'Scripts'
  ),
  path.join('/Applications', 'Adobe Illustrator*', 'Presets*', '**', 'Scripts')
];

// Find globs
function findPaths() {
  return _.flatten(
    installGlobs.map(g => {
      return glob.sync(g) || [];
    })
  );
}

// Can write
function canWrite(dir) {
  try {
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  }
  catch (e) {
    debug(e);
    return false;
  }
}

// Has build file
function hasBuildFile() {
  return fs.existsSync(buildPath);
}

// Install file
function install(dir) {
  fs.writeFileSync(path.join(dir, scriptName), fs.readFileSync(buildPath));
}

// Export
module.exports = {
  scriptName,
  buildDir,
  buildPath,
  installGlobs,
  findPaths,
  canWrite,
  hasBuildFile,
  install
};
