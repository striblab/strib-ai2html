# Strib ai2html

Helpful instructions, setup, and config for using [ai2html](http://ai2html.org/).

`ai2html` is an extremely helpful, open-source script for Adobe Illustrator that converts your Illustrator documents into html and css, specifically it exports a newsgraphic as an html page with html text that is layered over a background image. This is specifically helpful in making a graphic more responsive, performant, and SEO-friendly.

## Install

### Command line

This project provides a command line tool to help manage and install `ai2html` specific to the Star Tribune. You will need to have [NodeJS](https://nodejs.org/en/) installed. For Windows users, it's best to use the NodeJS prompt application that gets installed

- The best way to run the tool is with `npx` (which comes with NodeJS and `npm`). For example: `npx @striblab/strib-ai2html --help`
- Though not ideal, as `npx` provides an up-to-date experience, you can permamently install it with: `npm install @striblab/strib-ai2html -g`

### Fonts

We will need at least the Star Tribune web fonts for `ai2html` to generate correctly, and if you are converting print graphics, you will also want the Star Tribune print fonts. You will have to install fonts manually. Get the fonts from the Design department.

On a Mac:

1. Open your local Font library folder at `~/Library/Fonts`
   - This is a hidden folder, so it may be easier to do it on the command line with: `open ~/Library/Fonts`
1. Copy or drag fonts into this folder.

On Windows:

1. _TODO_

If you want to manually check if the web fonts can be found on your system, use the following command:

`npx @striblab/strib-ai2html fonts --check`

### Generate and update

The following is good to do on a regular basis.

1. Generate the custom `ai2html` script: `npx @striblab/strib-ai2html generate`
1. Install the custom `ai2html` script into Illustrator: `npx @striblab/strib-ai2html install`
   - More than likely you will need to be an administrator to run this, and may have to prefix the comand with `sudo`.

## Using ai2html

At the Star Tribune, the idea is that the produced file can be inserted into a Clickability article via an iframe via a [strib-tag](http://static.startribune.com/news/tools/embed-it/). It can fit inside the 525px standard middle column or you can hide the right column of the article and run it at 853px. It also has a version for mobile at 300px. Those are the 3 responsive sizes built into the template.

It is suggested to use the following template file:

- `templates/strib-digital-template.ai`: ??
- `templates/strib-digitial-template.ait`: ??
