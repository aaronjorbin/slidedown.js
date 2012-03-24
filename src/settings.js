var fs = require('fs.extra')
    , path = require('path')
    , _ = require('underscore');

module.exports = function(){
    this.projectdir     = process.cwd();
    var slidedownDir = this.slidedownDir = path.resolve(__dirname + '/..' ); 
    var templatedir;
    // Attempt to load the 
    try{
        this,slideshowConfig = JSON.parse( fs.readFileSync( this.projectdir + '/slidedown.json', 'ascii') );
    } catch(err) {
        // If the file doesn't exist, we will just use defaults
        this.slideshowConfig = {}; 
    }
    this.template     = this.slideshowConfig.template || 'remies';
    templatedir = this.templatedir  = this.slideshowConfig.templatedir || this.slidedownDir + '/template/' + this.template;
    this.title        = this.slideshowConfig.title || 'A slidedown.js presentation';
    this.source       = this.slideshowConfig.source ||  'slides.md'
    this.port         = this.slideshowConfig.port || 9000;
    this.publicDir    = this.slideshowConfig.publicDir || this.projectdir + '/public';
    this.header       = this.slideshowConfig.header || this.templatedir + '/header.html';
    this.footer       = this.slideshowConfig.footer ||  this.templatedir + '/footer.html';

    // JS AND CSS
    this.jsfiles    = [ ];
    this.cssfiles   = [ ];

    this.templateConfig = JSON.parse( fs.readFileSync( this.templatedir + '/config.json', 'ascii'  ) )
    if ( _.isArray( this.templateConfig.extensions ) ) 
    {
        this.jsfiles = _.map( this.templateConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.js';
        });
        this.cssfiles = _.map( this.templateConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.css';
        });
    }
    if ( _.isArray( this.slideshowConfig.extensions ) )
    {
        this.jsfiles = _.map( this.slideshowConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.js';
        });
        this.cssfiles = _.map( this.slideshowConfig.extensions , function(name){
            return slidedownDir + '/deck.js/extensions/' + name + '/deck.' + name + '.css';
        });
    }
    if ( _.isArray( this.templateConfig.css ) )
    {
        _.extend(this.cssfiles , _.map( this.templateConfig.css , function(name){
            return templatedir + '/css/'  + name ;
        }));
    }
    if ( _.isArray( this.templateConfig.js ) )
    {
        _.extend(this.jsfiles , _.map( this.templateConfig.js , function(name){
            return templatedir + '/js/'  + name ;
        }));
    }
};
