/**
 * Font functions
 */

// Dependencies
const fontManager = require('font-manager');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const json = require('json5');
const debug = require('debug')('strib-ai2html:fonts');

// Main class
class Fonts {
  constructor(options = {}) {
    this.options = options;
  }

  // List of fonts
  getInstalledFonts() {
    this.fonts = fontManager.getAvailableFontsSync();
    return this.fonts;
  }

  // Find fonts
  findFonts(search) {
    if (!this.fonts) {
      this.getInstalledFonts();
    }

    return _.filter(this.fonts, font => {
      return _.isRegExp(search)
        ? font.postscriptName.match(search)
        : ~font.postscriptName.indexOf(search);
    });
  }

  // Check our fonts
  async checkFonts() {
    await this.fetchConfig();
    this.getInstalledFonts();

    let found = [];

    this.fontSettings.forEach(set => {
      if (set.system_search) {
        let s = this.findFonts(new RegExp(set.system_search, 'i'));

        found.push({
          name: set.name,
          found: s && s.length ? s : false
        });
      }
    });

    return found;
  }

  // Get config
  async fetchConfig() {
    this.fontSettings = json.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'config', 'fonts.json5'),
        'utf-8'
      )
    );
  }
}

// Export
module.exports = {
  Fonts,
  fonts: options => {
    return new Fonts(options);
  }
};
