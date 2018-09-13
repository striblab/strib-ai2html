/**
 * Generate
 */

// Dependencies
const request = require('request');
const json = require('json5');
const path = require('path');
const fs = require('fs');
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
  }

  // Main generate function
  async generate() {
    // Get config
    this.config = await this.fetchConfig();

    // Get ai2html
    this.ai2htmlScript = await this.fetchAi2html();
  }

  // Get config
  async fetchConfig() {
    this.generatorSettings = json.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'config', 'generator.json5'),
        'utf-8'
      )
    );
    this.parseAi2htmlSettings(
      (this.ai2htmlSettings = json.parse(
        fs.readFileSync(
          path.join(__dirname, '..', 'config', 'ai2html-config.json5'),
          'utf-8'
        )
      ))
    );
    this.fontSettings = json.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'config', 'fonts.json5'),
        'utf-8'
      )
    );
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
