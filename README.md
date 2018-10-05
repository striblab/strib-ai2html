# Strib ai2html

Helpful instructions, setup, and config for using [ai2html](http://ai2html.org/).

`ai2html` is an extremely helpful, open-source script for Adobe Illustrator that converts your Illustrator documents into html and css, specifically it exports a newsgraphic as an html page with html text that is layered over a background image. This is specifically helpful in making a graphic more responsive, performant, and SEO-friendly.

At the Star Tribune, the idea is that the produced file can be inserted into a Clickability article via an iframe via a strip-tag. It can fit inside the 525px standard middle column or you can hide the right column of the article and run it at 853px. It also has a version for mobile at 300px. Those are the 3 responsive sizes built into the template.

## Setup

### Install fonts

We will need at least the Star Tribune web fonts for `ai2html` to generate correctly, and if you are converting print graphics, you will also want the Star Tribune print fonts. You will have to install fonts manually. Get the fonts from the Design department.

On a Mac:

1. Open your local Font library folder.
   - This is a hidden folder, so it may be easier to do it on the command line with: `open ~/Library/Fonts`
1. Copy or drag fonts into this folder.

On Windows:

1. _TODO_

Use the following command to check if all the correct web fonts are installed:

```
strib-ai2html fonts --check
```

### Generate

To help deal with our specific configuration and to use the latest version of `ai2html`, we generator the Illustrator script.

```
strib-ai2html generate
```

### Install ai2html in Illustrator

`ai2html` runs as a script/preset in Illustrator. We can use our tool to install it:

```
strib-ai2html install
```
