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
    , static = require('node-static'); 

// This is the default config object.  defaults will be overridden by slidedown.json
var defaults = function(){
    this.template   = 'remies';
    this.projectdir = process.cwd();  
    this.templatedir= path.dirname( process.argv[1]) + '/template/' + this.template;
    this.title      = 'A slidedown.js presentation';
    this.header     = this.templatedir + '/header.html';
    this.footer     = this.templatedir + '/footer.html';
    this.source     = 'slides.md'
    this.port       = 9000;
    this.jsfiles    = [];
    this.cssfiles   = [];
    this.publicDir  = this.projectdir + '/public';
};

var slidedown = function(){
    var header = footer = source = '';

    // load slidedown.json.  Create if neccessary. 
    // @todo:  unshort circuit
    var config = new defaults;
    console.log(config);
    
    // If public doesn't exist as a sibling to sourceFilenam, try to create it,
    if (! path.existsSync( config.publicDir ) )
        fs.mkdirSync(config.publicDir, '0775');

    // A couple of globals
    var output = false;
    var header = fs.readFileSync(config.header, 'ascii');
    console.log('header loaded');
    var footer = fs.readFileSync(config.footer, 'ascii');
    console.log('footer loaded');
    var sourceFilename = config.source; 
    var source = fs.readFileSync(sourceFilename, 'ascii');
    console.log('source: ' + sourceFilename +' loaded');
    writeFile('html');




    /* Setup our Server */
    var file = new static.Server( config.publicDir );
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        });
    }).listen(config.port);

    // Watch our HTML files
    fs.watchFile( sourceFilename, function(curr,prev){
        source = fs.readFileSync(sourceFilename, 'ascii');
        console.log('source reloaded');
        writeFile('html');
    });
    fs.watchFile(config.header, function(curr, prev){
        header = fs.readFileSync(config.header, 'ascii');
        //@todo Adjust some meta tags and add link to CSS files

        console.log('header reloaded');
        writeFile('html');
    })
    fs.watchFile(config.footer, function(curr,prev){
        footer = fs.readFileSync(config.footer, 'ascii');
        //@todo Add a link to the JS files

        console.log('footer reloaded');
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
}
var abc = new defaults;
slidedown();
