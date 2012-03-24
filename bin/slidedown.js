#! /usr/bin/env node
/*!
* slidedown.js
* Copyright (c) 2012 Aaron Jorbin 
* Dual licensed under the MIT license and GPL license.
* https://github.com/aaronjorbin/slidedown.js/blob/master/MIT-license.txt
* https://github.com/aaronjorbin/slidedown.js/blob/master/GPL-license.txt
*/

var debug = false;

/**
* Module dependencies.
*/

var fs = require('fs.extra')
    , path = require('path')
    , md =  require("node-markdown").Markdown
    , _ = require('underscore')
    , static = require('node-static') 
    , settings = require( __dirname + '/../src/settings.js'); 


// This is the default config object.  defaults will be overridden by slidedown.json

var slidedown = function(){
    var header = footer = source = '';

    // load slidedown.json.  Create if neccessary. 
    var config = new settings;

    // Add the file that converts our UL to slides last
    config.jsfiles.unshift( config.slidedownDir +'/deck.js/core/deck.core.js' );
    config.cssfiles.unshift( config.slidedownDir +'/deck.js/core/deck.core.css' );
    config.jsfiles.push( config.slidedownDir +'/src/public_slidedown.js' );

    var sourceFilename = config.source; 
    
    // If public doesn't exist as a sibling to sourceFilenam, try to create it,
    if (! path.existsSync( config.publicDir ) )
        fs.mkdirSync(config.publicDir, '0775');
    if (! path.existsSync( config.publicDir + '/css' ) )
        fs.mkdirSync(config.publicDir + '/css', '0775');
    if (! path.existsSync( config.publicDir + '/js' ) )
        fs.mkdirSync(config.publicDir + '/js', '0775');

    // Add Modernizor
    try{
        fs.readFileSync( config.publicDir + '/js//modernizr.custom.js');
    } catch(error)
    {
        // copy Modernizor
        fs.copy( config.slidedownDir + '/deck.js/modernizr.custom.js' , config.publicDir + '/js/modernizr.custom.js', function(err)
        {
            if ( err != undefined)
                console.log(err);
        });
    }

    function loadHeader(){
        header = fs.readFileSync(config.header, 'ascii');
        header =  header.replace(/\%\=title\=\%/gi , config.title);
        console.log('header loaded');
    }

    function loadFooter(){
        footer = fs.readFileSync(config.footer, 'ascii');
        console.log('footer loaded');
    }


    // Watch our HTML files
    fs.watchFile( sourceFilename, function(curr,prev){
        if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
        {
            source = fs.readFileSync(sourceFilename, 'ascii');
            console.log('source reloaded');
            writeFile('html');
        }
    });
    fs.watchFile(config.header, function(curr, prev){
        if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
        {
            loadHeader();
            writeFile('html');
        }
    })
    fs.watchFile(config.footer, function(curr,prev){
        if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
            writeFile('html');
    });
    // watch slides.md sibling dir images.  Create if needed.
    if (debug)
    console.log( config);

    // Watch our CSS Files
    _.each(config.cssfiles, function(css){
        fs.watchFile(css, function(curr,prev){
            if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
            {
                console.log('css file reloaded: ' + css);
                writeFile( 'css' );
            }
        });
    });

    // Watch our JS files
    _.each(config.jsfiles, function(js){
        fs.watchFile(js, function(curr,prev){
            if ( Date.parse( curr.mtime  )!= Date.parse( prev.mtime )  )
            {
                console.log('js file reloaded: ' + js );;
                writeFile( 'js' );
            }
        });
    });


    // Used to concat our js and css files
    function concatFiles(type, files){
        return _.reduce(files, function(memo, file){
            return memo + fs.readFileSync(file, 'ascii');
        },'');
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
    var fileRequest = new static.Server( config.publicDir );
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileRequest.serve(request, response);
        });
    }).listen(config.port);

    // Everything is ready to go, let's do our first build
    loadHeader();
    loadFooter();
    source = fs.readFileSync(sourceFilename, 'ascii');
    console.log('source: ' + sourceFilename +' loaded');
    writeFile('html');
    writeFile('css');
    writeFile('js');
}

slidedown();
//    var config = new settings;
//console.log(config);
