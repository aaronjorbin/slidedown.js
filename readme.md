# Slidedown.js

Seporating out slidecontent and slide presentation

## Why Slidedown.js

The goal of slidedown.js is to make the generation of html/css/js slideshows to be as simple as creating a list in a markdown file.

Currently slidedown.js supports deck.js. However it is written in a manner that allows easily switching to a different slideshow when new ones come around. Instead of being tied to one theme and one style, slidedown.js frees you to change the appearance without changing your content.

## Templates

Templates are inspired by the concept of themes in WordPress. Switching between them should be seemless. Right now, slidedown.js comes with an Remies, named after a great bar in Marquette, Michigan

### Template Tags
Templates and slides can implement template tags which will be replaced when the slides are generated. The current list of template tags is:

* %=title=% &mdash; Replaced with the Title that is set by the slideshow config

## How it works

Slidedown.js requires nodejs and npm. Clone the repository and from the directory run `sudo npm install -g`. Then create a slides.md file and run `slidedown.js`. If you want to customize your presentation, a slidedown.json file in your presentation directory can overide any of the defaults (and any of the template defaults). 

## Defaults

```
{
    'template': 'remies', //the name of the theme you want to you use.  If you are using an included template, this is all you need to specify
    'templatedir': slidedownDirectory + '/template/' + template, // If you are using a non included template, you need to specify where it is.  Should be a full path.
    'title': 'A slidedown.js presentation', // Themes can use a template tag to add a title automattically
    'source': 'slides.md', // the file that is used for the slides
    'port'; 9000 , // The port that the files are served on
    'publicDir': projectDirectory +  '/public' // where the processed files are added and served from.  
    'header': templatedir + '/header.html' // The header file
    'footer': templatedir + '/footer.html' // The header file
    'css': ['style.css'] // CSS that is specific to this slideshow.  Should be an array of file names that are in a css directory in the projectDirectory
    'js': ['script.js'] // JS that is specific to this slideshow.  Should be an array of file names that are in a js directory in the projectDirectory

}
```
projectDirectory refers to where you are running Slidedown.js.


# Administrivia

## Author

Slidedown.js was written by [Aaron Jorbin](http://aaron.jorb.in) <aaron@jorb.in> 

## Bugs & so forth

Please reqport bugs or request new features at the GitHub page for Slidedown.js: https://github.com/aaronjorbin/slidedown.js
