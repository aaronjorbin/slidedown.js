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
    , md =  require("node-markdown").Markdown
    , static = require('node-static'); 

// A couple of globals
var output = false;
var header = fs.readFileSync('header.html', 'ascii');
console.log('header loaded');
var footer = fs.readFileSync('footer.html', 'ascii');
console.log('footer loaded');
var sourceFilename = process.argv[2] || 'slides.md';
var source = fs.readFileSync(sourceFilename, 'ascii');
console.log('source: ' + sourceFilename +' loaded');
writeFile();

/* Setup our Server */
var file = new static.Server('./public');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(9000);

// The first arg is the file to watch
fs.watchFile( sourceFilename, function(curr,prev){
    source = fs.readFileSync(sourceFilename, 'ascii');
    console.log('source reloaded');
    writeFile();
});
fs.watchFile('header.html', function(curr, prev){
    header = fs.readFileSync('header.html', 'ascii');
    console.log('header reloaded');
    writeFile();
})
fs.watchFile('footer.html', function(curr,prev){
    footer = fs.readFileSync('footer.html', 'ascii');
    console.log('footer reloaded');
    writeFile();
});

// The second arg is the output file
function writeFile(){
    var filename =  process.argv[3] || sourceFilename.replace(/\.md/, '.html');
    var innerHtml = md(source);
    var html = header + innerHtml + footer;
    fs.writeFileSync('public/'+ filename, html, 'ascii');
    console.log( filename + ' written');
}
