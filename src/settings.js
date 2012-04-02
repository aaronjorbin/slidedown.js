var fs = require('fs.extra')
    , path = require('path')
    , _ = require('underscore');
    slidedownDir = path.resolve(__dirname + '/..' ); 

var deckJsConfig = function(templateConfig , slideshowConfig   )
{
    this.jsfiles      = [ slidedownDir +'/deck.js/core/deck.core.js' ];
    this.cssfiles     = [ slidedownDir +'/deck.js/core/deck.core.css'];
    this.latejsfiles  = [ slidedownDir +'/src/public_deckjs_slidedown.js'];
    this.latecssfiles = [ ];
    this.modernizor = true;

    if ( _.isArray( templateConfig.extensions ) ) 
    {
        this.jsfiles.push.apply( this.jsfiles, _.map( templateConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.js';
        }));
        this.cssfiles.push.apply( this.cssfiles, _.map( templateConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.css';
        }));
    }

    if ( _.isArray( slideshowConfig.extensions ) )
    {
        this.jsfiles.push.apply( this.jsfiles, _.map( slideshowConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.js';
        }));
        this.cssfiles.push.apply( this.cssfiles, _.map( slideshowConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.css';
        }));
    }
}

var basemap = {
   'deck.js' : deckJsConfig 
};

module.exports = function(){
    this.projectdir     = process.cwd();
    this.slidedownDir = slidedownDir; 
    var templatedir;

    // Attempt to load a config for a specific slideshow
    try{
        this,slideshowConfig = JSON.parse( fs.readFileSync( this.projectdir + '/slidedown.json', 'ascii') );
    } catch(err) {
        // If the file doesn't exist, we will just use defaults
        this.slideshowConfig = {}; 
    }

    // Load the Template 
    this.template     = this.slideshowConfig.template || 'remies';
    templatedir = this.templatedir  = this.slideshowConfig.templatedir || this.slidedownDir + '/template/' + this.template;
    this.templateConfig = JSON.parse( fs.readFileSync( this.templatedir + '/config.json', 'ascii'  ) )

    // Based on the template and the slideshowconfig, setup some properties
    this.title        = this.slideshowConfig.title || 'A slidedown.js presentation';
    this.source       = this.slideshowConfig.source ||  'slides.md'
    this.port         = this.slideshowConfig.port || 9000;
    this.publicDir    = this.slideshowConfig.publicDir || this.projectdir + '/public';
    this.header       = this.slideshowConfig.header || this.templatedir + '/header.html';
    this.footer       = this.slideshowConfig.footer ||  this.templatedir + '/footer.html';
    this.base         = this.slideshowConfig.base || this.templateConfig.base || 'deck.js' ;  

    // JS AND CSS
    var baseFiles = new basemap[this.base]( this.templateConfig, this.slideshowConfig );
    this.jsfiles  = baseFiles.jsfiles;
    this.cssfiles = baseFiles.cssfiles;

    // register if our base requires modernizor
    this.modernizor = baseFiles.modernizor || false;

    // Template specific css and js
    if ( _.isArray( this.templateConfig.css ) )
    {
        this.cssfiles.push.apply( this.cssfiles , _.map( this.templateConfig.css , function(name){
            return templatedir + '/css/'  + name ;
        }));
    }

    if ( _.isArray( this.templateConfig.js ) )
    {
        this.jsfiles.push.apply( this.jsfiles , _.map( this.templateConfig.js , function(name){
            return templatedir + '/js/'  + name ;
        }));
    }
    this.jsfiles.push.apply(this.jsfiles, baseFiles.latejsfiles);
    this.cssfiles.push.apply(this.cssfiles, baseFiles.latecssfiles);

    _.extend(this.cssfiles, baseFiles.latecssfiles);

};

