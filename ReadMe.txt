http://ai2html.org/

OVERVIEW:  ai2html is a script for Illustrator that exports a newsgraphic as an html page with html text that is layered over a background image. The idea is that the produced file can be inserted into a Clickability article via an iframe via a strip-tag. It can fit inside the 525px standard middle column or you can hide the right column of the article and run it at 853px.  It also has a version for mobile at 300px.  Those are the 3 responsive sizes built into the template.


  




SETUP / WALKTHROUGH WITH EXAMPLE FILE (ai2html-example-sewer.ai)

1. Before opening Illustrator:

you will need to take the ai2html_STRIB_712.js file and put it into 
/Applications/Adobe Illustrator CC/Presets/en_US/Scripts/  note:  you will need to use your local admin.

Make sure all of the fonts in the Strib-Desktop-Fonts-2018 are properly installed.  These are installed on the mac with Font Book.
 
2. Open ai2html-example-sewer.ai in Illustrator
 	
3. Go to File > Scripts > ai2html_STRIB_712  

4. You should get a message similar to:

		Nice work!
		Information
		================
		• Custom CSS blocks: 1
		• Custom HTML blocks: 1
		• The image_output_path folder did not exist, so the folder was created.
		• Script ran in 2.7 seconds

		================
		Generate promo image?

For now hit "NO" to bypass making the promo image.

5. You should find a new folder in this directory named 'ai2html-SewerTest'.  Open up 'SewerTest.html' in Chrome.  Feel free to change the browser size. You will find it has breakpoints at 853(wide), 525(regular) and 300(mobile).  You will also see that that the html text is red
and layered over black text (which is part of the image).  The red text is for reference; to check that all the text that was in the print graphic is now represented in the web graphic. When you are ready to make the final files you will change 'testing-mode: yes' to 'testing-mode: no' in the ai2html-settings configuration text box (see below) and rerun the ai2html script (File > Scripts > ai2html_STRIB_712) again.


CONFIGURING AI2HTML - 

ai2html-settingssettings_version: 0.71.2create_promo_image: yesimage_format: autoresponsiveness: fixedoutput: one-fileproject_name: SewerTest  - This should be changed to the name of the project.  Prepended to file names.
html_output_path: /ai2html-SewerTest/ - Name of the output folder.testing_mode: yes   - This will bake your type onto the image so you can compare it to the css text (shown as red).  You will need to set this to "no" when you are ready to publish.


CONVERTING AN EXISTING PRINT GRAPHIC

This documentation starts with you having a finished Illustrator print graphic AND the script and fonts installed correctly (see above).

1. Open the template 'Strib-digital-template.ait' in Illustrator

2. Open the finished print graphic in another illustrator window

3. Copy and paste the graphic (just what you want to show - minus the hed and deck - which will go into article above the graphic) into either the first artboard (wide: 853px ) or second (standard: 525px) of 'Strib-digital-template.ai'. You will need to size everything you want to show into those 2 widths - THE HEIGHT CAN BE CHANGED.

4. you will need to change all of the print fonts into one of the web fonts shown below in the 'Illustrator Fonts for Web' box shown below the artboard. Note: you can use the eyedropper tool to quickly change those fonts but you will need to have font sizes of at least 10px.

5. 




Notes:
I converted the ai2html.js file to be specific to us. That (and the correct fonts) needs to be installed into Illustrator before you can use it.


css
body {margin:0;} is set automatically

webfonts 
http://static.startribune.com/css/strib-fonts-db.css is loaded automatically

resizer js
http://static.startribune.com/js/ai2html-STRIB-resizer.js is loaded automatically


Link to google sheet with Strib ai2html

