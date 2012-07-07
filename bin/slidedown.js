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
    , _ = require('underscore')
    , static = require('node-static') 
    , settings = require( __dirname + '/../src/settings.js') 
    , templateTags = require( __dirname + '/../src/templateTags.js'); 


var slidedown = function(){
    var header = footer = source = '';

    var config = new settings;
    // Add the file that converts our UL to slides last

    if (debug)
    console.log( config);

    var sourceFilename = config.source; 
    
    // If public doesn't exist as a sibling to sourceFilenam, try to create it,
    if (! path.existsSync( config.publicDir ) )
        fs.mkdirSync(config.publicDir, '0775');
    if (! path.existsSync( config.publicDir + '/css' ) )
        fs.mkdirSync(config.publicDir + '/css', '0775');
    if (! path.existsSync( config.publicDir + '/js' ) )
        fs.mkdirSync(config.publicDir + '/js', '0775');

    if (config.modernizr){
        // Add Modernizor if it's not there already
        try{
            fs.readFileSync( config.publicDir + '/js/modernizr.custom.js');
        } catch(error)
        {
            // copy Modernizor
            fs.copy( config.slidedownDir + '/deck.js/modernizr.custom.js' , config.publicDir + '/js/modernizr.custom.js', function(err)
            {
                if ( err != undefined)
                    console.log(err);
                else 
                    console.log('modernizer added');
            });

        }
    }

    // Add jQuery if it's not already there
    try{
        fs.readFileSync( config.publicDir + '/js/jquery.js');
    } catch(error)
    {
        // copy Modernizor
        fs.copy( config.slidedownDir + '/deck.js/jquery-1.7.min.js' , config.publicDir + '/js/jquery.js', function(err)
        {
            if ( err != undefined)
                console.log(err);
        });
    }


    function loadFile(which) {
        console.log(which + ' loaded');
        return templateTags(  fs.readFileSync(config[which] , 'ascii'),config , true );
    }

    function loadHeader(){
        header = loadFile('header');
    }

    function loadFooter(){
        footer = loadFile('footer');
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
        {
            loadFooter();
            writeFile('html');
        }
    });


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
            var comment = '\n /* ' + file + ' */ \n';
            return memo + comment + fs.readFileSync(file, 'ascii');
        },'');
    }

    // The second arg is the output file
    function writeFile( type ){
        var content;
        var filename;
        if (type =='html' )
        {
            var innerHtml = templateTags( source , config );
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
