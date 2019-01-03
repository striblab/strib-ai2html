/**
 * Methods for install
 */

// Dependencies
const path = require('path');
const fs = require('fs-extra');
const request = require('request');
const json = require('json5');
const glob = require('glob');
const _ = require('lodash');
const { Fonts } = require('./fonts.js');
const debug = require('debug')('strib-ai2html:install');

// Main class for installing
class Install {
  constructor(options = {}) {
    this.options = _.extend({}, options, {
      fontCheck: true,
      ai2htmlConfig: path.join(__dirname, '..', 'config', 'ai2html.json5'),
      installConfig: path.join(__dirname, '..', 'config', 'install.json5'),
      scriptName: 'strib-ai2html.js',
      scriptConfig: 'ai2html-config.json',
      templateGlobs: [path.join(__dirname, '..', 'templates', '**', '*.ait')],
      illustratorScriptGlobs: [
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
      ],
      illustratorTemplateGlobs: [
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
      ]
    });

    // Some checks
    if (!options.ai2htmlVersion) {
      throw new Error(
        'Generator needs a "ai2htmlVersion" options; this should be a tag for the ai2html project, such as "v0.77.0".'
      );
    }

    // Create fonts instance
    this.fonts = new Fonts();
  }

  // Bring it all together
  async compile() {
    // Check fonts (this gets the font settings needed later)
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

    // Get config
    try {
      this.compileAi2htmlConfig();
    }
    catch (e) {
      debug(e);
      throw new Error('Unable to compile ai2html settings.');
    }

    // Get ai2html
    try {
      this.ai2htmlScript = await this.fetchAi2html();
    }
    catch (e) {
      debug(e);
      throw new Error('Unable to fetch ai2html script.');
    }
  }

  // Install
  install() {
    // Figure out places and do some checks
    if (!this.options.illustratorScripts) {
      let search = this.findGlobsPaths(this.options.illustratorScriptGlobs);
      if (!search || !search.length) {
        throw new Error('Unable to find correct path to Illustrator scripts.');
      }

      this.options.illustratorScripts = search[0];
    }
    if (!this.options.illustratorTemplates) {
      let search = this.findGlobsPaths(this.options.illustratorTemplateGlobs);
      if (!search || !search.length) {
        throw new Error(
          'Unable to find correct path to Illustrator templates.'
        );
      }

      this.options.illustratorTemplates = search[0];
    }

    // Check if we can write to it
    if (!this.canWrite(this.options.illustratorScripts)) {
      throw new Error(
        `Unable to write to Illustrator script directory; you may need to be an administrator an use "sudo": ${
          this.options.illustratorScripts
        }`
      );
    }
    if (!this.canWrite(this.options.illustratorTemplates)) {
      throw new Error(
        `Unable to write to Illustrator template directory; you may need to be an administrator an use "sudo": ${
          this.options.illustratorTemplates
        }`
      );
    }

    // Install script file and config file
    let scriptName = path.join(
      this.options.illustratorScripts,
      this.options.scriptName
    );
    let scriptConfig = path.join(
      this.options.illustratorScripts,
      this.options.scriptConfig
    );
    let outputScripts = [scriptName, scriptConfig];
    fs.writeFileSync(scriptName, this.ai2htmlScript);
    fs.writeFileSync(
      scriptConfig,
      JSON.stringify(this.ai2htmlConfig, null, '  ')
    );

    // Install templates
    let templates = _.flatten(
      this.options.templateGlobs.map(g => {
        return glob.sync(g) || [];
      })
    );

    let outputTemplates = [];
    templates.forEach(p => {
      let fileName = path.basename(p);
      let t = path.join(this.options.illustratorTemplates, fileName);
      outputTemplates.push(t);
      fs.writeFileSync(t, fs.readFileSync(p));
    });

    return { templates: outputTemplates, scripts: outputScripts };
  }

  // Create ai2html config
  compileAi2htmlConfig() {
    // Get config from project
    this.ai2htmlConfig = json.parse(
      fs.readFileSync(this.options.ai2htmlConfig, 'utf-8')
    );

    // Set version
    this.ai2htmlConfig.settings_version = this.options.ai2htmlVersion;

    // Set fonts
    this.ai2htmlConfig.fonts = this.parseAi2htmlFontSettings(
      this.fonts.fontSettings
    );
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

  // Find paths from array of globs
  findGlobsPaths(globs) {
    return _.flatten(
      globs.map(g => {
        return glob.sync(g) || [];
      })
    );
  }

  // Determine if can write to a directory
  canWrite(dir) {
    try {
      fs.accessSync(dir, fs.constants.W_OK);
      return true;
    }
    catch (e) {
      debug(e);
      return false;
    }
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
  Install,
  install: options => {
    return new Install(options);
  }
};
