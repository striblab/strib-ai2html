/**
 * Just some methods around outputing to the command line.
 */

// Dependencies
const chalk = require('chalk');

// Main class
class CLIOutput {
  constructor(options = {}) {
    this.options = options;

    this.writeLine = options.writeLine || console.error;
    this.indent = options.indent || '   ';
  }

  // Intro
  intro(title) {
    if (title) {
      this.cleanedMultiline(chalk`
        |{green Strib ai2html}
        |{grey ------------}
        |{bold ${this.indentInput(title)}}`);
    }
    else {
      this.cleanedMultiline(chalk`
      |{green Strib ai2html}
      |{grey ------------}`);
    }
  }

  // Basic output
  out(input, noNewLine = false) {
    return this.cleanedMultiline(
      chalk`${noNewLine ? '' : '\n'}${this.indent}${this.indentInput(input)}`
    );
  }

  // All done
  done(message = 'Done.') {
    this.cleanedMultiline(chalk`
      |{green ${this.indentInput(message)}}
    `);
  }

  // Error
  error(input) {
    if (input && input.stack) {
      this.cleanedMultiline(chalk`
        |{red --- {bold Stack trace} ------------}
        |{red ${this.indentInput(input.stack)}}
        |{red ----------------------------}`);
    }
    this.cleanedMultiline(chalk`
      |{red ${this.indentInput(
    input && input.message ? input.message : input.toString()
  )}}`);
  }

  // Exit program
  exit(message, code = 1) {
    this.error(`${message}
    |`);
    process.exit(code);
  }

  // Turn multiline output to input
  indentInput(input, prefix = '') {
    if (input) {
      return input
        .split('\n')
        .map(l => `${this.indent}${prefix}${l.trim()}`)
        .join('\n')
        .trim();
    }
  }

  // Wrapper
  cleanedMultiline(input) {
    return this.writeLine(this.cleanMultiline(input));
  }

  // Method to make it easier to have the code line up for editing
  cleanMultiline(input) {
    return input.replace(/[ \t]+\|/gm, this.indent);
  }
}

module.exports = {
  CLIOutput,
  cliOutput: options => {
    return new CLIOutput(options);
  }
};
