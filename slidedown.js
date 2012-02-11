#! /usr/bin/env node
/*!
* slidedown.js
* Copyright (c) 2012 Aaron Jorbin 
* Dual licensed under the MIT license and GPL license.
* https://github.com/aaronjorbin/slidedown.js/blob/master/MIT-license.txt
* https://github.com/aaronjorbin/slidedown.js/blob/master/GPL-license.txt
*/

/**
* Module dependencies.
*/

var fs = require('fs')
    , path = require('path')
    , md =  require("node-markdown").Markdown
    , _ = require('underscore')
    , static = require('node-static'); 

// This is the default config object.  defaults will be overridden by slidedown.json
var settings = function(){
    this.template     = 'remies';
    this.projectdir   = process.cwd();  
    var slidedownDir = this.slidedownDir = path.dirname( process.argv[1]);
    this.templatedir  = this.slidedownDir + '/template/' + this.template;
    this.title        = 'A slidedown.js presentation';
    this.source       = 'slides.md'
    this.port         = 9000;
    this.publicDir    = this.projectdir + '/public';
    this.header       = this.templatedir + '/header.html';
    this.footer       = this.templatedir + '/footer.html';

    // You'll want to keep these files
    this.jsfiles    = [ this.slidedownDir + '/deck.js/core/deck.core.js' ];
    this.cssfiles   = [ this.slidedownDir + '/deck.js/core/deck.core.css' ];

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

};

var slidedown = function(){
    var header = footer = source = '';

    // load slidedown.json.  Create if neccessary. 
    // @todo:  unshort circuit
    var config = new settings;

    // Add the file that converts our UL to slides last
    config.jsfiles.push( config.slidedownDir +'/public_slidedown.js' );

    var sourceFilename = config.source; 
    
    // If public doesn't exist as a sibling to sourceFilenam, try to create it,
    if (! path.existsSync( config.publicDir ) )
        fs.mkdirSync(config.publicDir, '0775');

    function loadHeader(){
        header = fs.readFileSync(config.header, 'ascii');
        header =  header.replace(/\%\=title\=\%/gi , config.title);
        console.log('header loaded');
    }
    function loadFooter(){
        footer = fs.readFileSync(config.footer, 'ascii');
        console.log('footer loaded');
    }

    loadHeader();
    loadFooter();
    var source = fs.readFileSync(sourceFilename, 'ascii');
    console.log('source: ' + sourceFilename +' loaded');
    writeFile('html');

    // Watch our HTML files
    fs.watchFile( sourceFilename, function(curr,prev){
        source = fs.readFileSync(sourceFilename, 'ascii');
        console.log('source reloaded');
        writeFile('html');
    });
    fs.watchFile(config.header, function(curr, prev){
        loadHeader();
        writeFile('html');
    })
    fs.watchFile(config.footer, function(curr,prev){
        writeFile('html');
    });
    // watch slides.md sibling dir images.  Create if needed.

    // Watch our CSS Files

    // Watch our JS files


    // Used to concat our js and css files
    function concatFiles(){

    }

    // The second arg is the output file
    function writeFile( type ){
        var content;
        var filename;
        if (type =='html' )
        {
            var innerHtml = md(source);
            content = header + innerHtml + footer;
            filename = 'index.html';
        }
        else if(type == 'js')
        {
            content = concatFiles('js', config.jsfiles);
            filename = 'js/script.js';
        }
        else if(type == 'css')
        {
            content = concatFiles('css', config.cssfiles);
            filename = 'css/style.css';
        }
        fs.writeFileSync( config.publicDir +  '/' + filename, content, 'ascii');
        console.log( filename + ' written');
    }

    // Setup our Server
    var file = new static.Server( config.publicDir );
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        });
    }).listen(config.port);
}

//slidedown();

    var config = new settings;    console.log(config);
