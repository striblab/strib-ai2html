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

// Template location
const templateDir = path.join(__dirname, '..', 'templates');

// Glob for templates
const templateGlobs = [path.join(templateDir, '**', '*.ait')];

// Possible script install locations
const installScriptGlobs = [
  path.join(
    'C:',
    'Program Files',
    'Adobe',
    'Adobe Illustrator*',
    'Presets*',
    '**',
    'Scripts'
  ),
  path.join(
    '/',
    'Applications',
    'Adobe Illustrator*',
    'Presets*',
    '**',
    'Scripts'
  )
];

// Possible template install locations
const installTemplateGlobs = [
  path.join(
    'C:',
    'Program Files',
    'Adobe',
    'Adobe Illustrator*',
    'Cool*Extras*',
    '**',
    'Templates'
  ),
  path.join(
    '/',
    'Applications',
    'Adobe Illustrator*',
    'Cool*Extras*',
    '**',
    'Templates'
  )
];

// Find globs
function findGlobsPaths(globs) {
  return _.flatten(
    globs.map(g => {
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

// Install script file
function installScript(dir) {
  fs.writeFileSync(path.join(dir, scriptName), fs.readFileSync(buildPath));
}

// Install templates
function installTemplates(dir) {
  let templates = _.flatten(
    templateGlobs.map(g => {
      return glob.sync(g) || [];
    })
  );

  templates.forEach(p => {
    let fileName = path.basename(p);
    fs.writeFileSync(path.join(dir, fileName), fs.readFileSync(p));
  });

  return templates;
}

// Export
module.exports = {
  scriptName,
  buildDir,
  buildPath,
  templateDir,
  templateGlobs,
  installScriptGlobs,
  installTemplateGlobs,
  findGlobsPaths,
  canWrite,
  hasBuildFile,
  installScript,
  installTemplates
};
