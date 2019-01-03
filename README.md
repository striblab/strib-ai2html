# Strib ai2html

Helpful instructions, setup, and config for using [ai2html](http://ai2html.org/).

`ai2html` is an extremely helpful, open-source script for Adobe Illustrator that converts your Illustrator documents into html and css, specifically it exports a newsgraphic as an html page with html text that is layered over a background image. This is specifically helpful in making a graphic more responsive, performant, and SEO-friendly.

## Install

### Command line

This project provides a command line tool to help manage and install `ai2html` specific to the Star Tribune. You will need to have [NodeJS](https://nodejs.org/en/) installed. For Windows users, it's best to use the NodeJS prompt application that gets installed

1. Install tool globally: `npm install @striblab/strib-ai2html -g`

- To update, run the same command.

_Note: In theory this tool could be used with `npx`, but doing that causes some odd errors. TODO: Revisit as `npx` allows users to use the newest version of the tool._

### Script and templates

Run the following to compile and install the `ai2html` script and config, as well as the Strib template:

1. Run: `strib-ai2html install`
   - More than likely you will need to be an administrator to run this, and may have to prefix the comand with `sudo`.

If you run into font checking issues, see the _Fonts_ section below.

### Fonts

We will need at least the Star Tribune web fonts for `ai2html` to generate correctly, and if you are converting print graphics, you will also want the Star Tribune print fonts. You will have to install fonts manually. Get the fonts from the Design department.

On a Mac:

1. Open your local Font library folder at `~/Library/Fonts`
   - This is a hidden folder, so it may be easier to do it on the command line with: `open ~/Library/Fonts`
1. Copy or drag fonts into this folder.

On Windows:

1. _TODO_

If you want to manually check if the web fonts can be found on your system, use the following command:

`strib-ai2html fonts --check`

## Using ai2html

At the Star Tribune, the idea is that the produced file can be inserted into a Clickability article via an iframe via a [strib-tag](http://static.startribune.com/news/tools/embed-it/). It can fit inside the 525px standard middle column or you can hide the right column of the article and run it at 853px. It also has a version for mobile at 300px. Those are the 3 responsive sizes built into the template.

The `strib-ai2html install` command will install the templates found in `templates/` into Illustrator. This means, you can do `File > New From Template` in Illustrator.

### Project structure

An Illustrator project that is going to use `ai2html` should be structured like the following, where `PROJECT-NAME` should change based on your project, such as `dancing-robots`:

```
PROJECT-NAME/
  PROJECT-NAME.ai
  ai2html-config.json
  ai2html-preview-template.html
```

When `ai2html` is run, you will end up with output similar to the following depending on certain options:

```
PROJECT-NAME/
  ai2html-output/
    PROJECT-NAME-mobile.png
    PROJECT-NAME-regular.png
    PROJECT-NAME-wide.png
    PROJECT-NAME.html  <-- HTML fragment version
    PROJECT-NAME.preview.html  <-- Full, embeddable HTML version based from preview template
  PROJECT-NAME-promo.png
  PROJECT-NAME.ai
  ai2html-preview-template.html
```

### Settings

One of the main goals of this Strib-specific projects is to set some of the settings by default. `ai2html` has many [settings](http://ai2html.org/#settings). And there are a few ways to manage settings.

Often, you may not need to update any settings.

#### Config file

You can create an `ai2html-config.json` file next your Illustrator file. This is the preferred way, but not necessary. This will override any of the settings that we installed with this project.

#### Text block

`ai2html` will read specifically-named text blocks in your Illustrator file; these are just blocks of texts with a certain first line. If you include a `ai2html-settings` block, `ai2html` will attempt to read these as settings. The text block may look something like the following:

```
ai2html-settings
create_promo_image: yes
image_format: auto
responsiveness: dynamic
```

Lines that can't be parsed, such as `// comments` will show a warning but will not affect the output.

### Artboards

See the [artboards section](http://ai2html.org/#artboards-palette) on the `ai2html` page for more details. The template provided here has Strib standard size artboard provided.

## Testing

### Manual

A manual test can be found in `tests/manual/simple-project/`. Use Illustrator to open `simple-project.ai` and run `ai2html` to output. Then run a web server to see it embedded, such as `http-server tests/manual/` and go to `http://localhost:8080/embed-test.html` in your browser.
