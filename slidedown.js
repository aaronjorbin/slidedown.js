#! /usr/bin/env node
/*!
* slidedown
* Copyright(c) 2012 Aaron Jorbin <aaron@jorb.in> 
* MIT Licensed
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
var source = fs.readFileSync(process.argv[2], 'ascii');
writeFile();
var file = new static.Server('./public');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(8080);


if (process.argv.length > 4){
    console.error('three arguments are required');
    process.exit(1);
}

// The first arg is the file to watch
fs.watchFile( process.argv[2], function(curr,prev){
    source = fs.readFileSync(process.argv[2], 'ascii');
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
    var filename =  process.argv[3] ||  process.argv[2].replace(/\.md/, '.html');
    var innerHtml = md(source);
    var html = header + innerHtml + footer;
    fs.writeFileSync('public/'+ filename, html, 'ascii');
    console.log( filename + ' written');
}


