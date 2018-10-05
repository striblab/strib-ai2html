/**
 * Generate
 */

// Dependencies
const request = require('request');
const json = require('json5');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const esprima = require('esprima');
const escodegen = require('escodegen');
const { Fonts } = require('./fonts.js');
const errors = require('./errors.js');
const debug = require('debug')('strib-ai2html:generate');

// Generator class
class Generator {
  constructor(options = {}) {
    this.options = options;

    // Some checks
    if (!options.ai2htmlVersion) {
      throw new Error(
        'Generator needs a "ai2htmlVersion" options; this should be a tag for the ai2html project, such as "v0.77.0".'
      );
    }

    // Create fonts instance
    this.fonts = new Fonts();
  }

  // Main generate function
  async generate() {
    // Get config
    this.config = await this.fetchConfig();

    // Get ai2html
    this.ai2htmlScript = await this.fetchAi2html();

    // Check fonts
    if (this.options.fontCheck !== false) {
      let check = await this.fonts.checkFonts();
      let missing = _.filter(check, set => !set.found);
      if (missing && missing.length) {
        let e = new Error(`Missing ${missing.length} fonts.`);
        e.id = errors.fontCheck;
        e.data = check;
        throw e;
      }
    }
    else {
      debug('Skipping font check.');
    }

    // Parse and inject settings
    let newScript = await this.scriptInjection();

    // Output
    let output = path.join(__dirname, '..', 'build', 'strib-ai2html.js');
    fs.writeFileSync(output, newScript);
    return output;
  }

  // Inject settings
  async scriptInjection() {
    // Parse original script
    let scriptTree = esprima.parse(this.ai2htmlScript, { comment: true });

    // Parse our new settings
    let settingsCode = `var defaultBaseSettings = ${JSON.stringify(
      this.ai2htmlSettings
    )};`;
    let settingsTree = esprima.parse(settingsCode);

    // Parse font settings
    let fontSettingsCode = `var fonts = ${JSON.stringify(
      this.parseAi2htmlFontSettings(this.fonts.fontSettings)
    )}`;
    let fontSettingsTree = esprima.parse(fontSettingsCode);

    // Insert settings
    let settingsBlockIndex = _.findIndex(scriptTree.body[0].body.body, b => {
      return (
        b &&
        b.declarations &&
        b.declarations[0] &&
        b.declarations[0].id.name === 'defaultBaseSettings'
      );
    });
    if (!settingsBlockIndex) {
      throw new Error(
        'Unable to find the defaultBaseSettings variable in the ai2html script.'
      );
    }
    scriptTree.body[0].body.body[settingsBlockIndex] = settingsTree.body[0];

    // Insert font settings
    let fontSettingsBlockIndex = _.findIndex(
      scriptTree.body[0].body.body,
      b => {
        return (
          b &&
          b.declarations &&
          b.declarations[0] &&
          b.declarations[0].id.name === 'fonts'
        );
      }
    );
    if (!fontSettingsBlockIndex) {
      throw new Error(
        'Unable to find the fonts variable in the ai2html script.'
      );
    }
    scriptTree.body[0].body.body[fontSettingsBlockIndex] =
      fontSettingsTree.body[0];

    // Output new scripts
    return escodegen.generate(scriptTree, { comment: true });
  }

  // Get config
  async fetchConfig() {
    debug('Loading config files.');
    this.generatorSettings = json.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'config', 'generator.json5'),
        'utf-8'
      )
    );
    this.ai2htmlSettings = this.parseAi2htmlSettings(
      json.parse(
        fs.readFileSync(
          path.join(__dirname, '..', 'config', 'ai2html-config.json5'),
          'utf-8'
        )
      )
    );

    return {
      generatorSettings: this.generatorSettings,
      ai2htmlSettings: this.ai2htmlSettings
    };
  }

  // Turn font settings into ai2html font settings
  parseAi2htmlFontSettings(settings) {
    let parsed = [];
    _.each(settings, font => {
      if (!font.known_postscript_names) {
        return;
      }

      font.known_postscript_names.forEach(p => {
        parsed.push({
          aifont: p,
          family: font.family,
          weight: font.weight,
          style: font.style
        });
      });
    });

    return parsed;
  }

  // Parse settings
  parseAi2htmlSettings(settings) {
    if (
      settings.settings_version &&
      settings.settings_version.defaultValue === 'scriptVersion'
    ) {
      settings.settings_version.defaultValue = this.options.ai2htmlVersion;
    }

    return settings;
  }

  // Get raw file
  async fetchAi2html() {
    const url = `https://raw.githubusercontent.com/newsdev/ai2html/${
      this.options.ai2htmlVersion
    }/ai2html.js`;
    debug(`Fetching ${url}`);

    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        if (response.statusCode >= 300) {
          return reject(
            new Error(
              `Fetching "${url}" returned a status code of: ${
                response.statusCode
              }`
            )
          );
        }
        if (!body) {
          return reject(new Error(`Fetching "${url}" returned en empty body.`));
        }

        resolve(body);
      });
    });
  }
}

// Export
module.exports = {
  Generator,
  generate: async options => {
    let g = new Generator(options);
    await g.generate();
    return g;
  }
};
