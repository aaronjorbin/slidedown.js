/*!
* Parse content for Template Tags.  
* Passing content returns content that we realy want to use
*/

var  md =  require("node-markdown").Markdown;

module.exports = function( input, config ) {

    // Title
    input = input.replace(/\%\=title\=\%/gi , config.title);

    // Twitter Embends
    // @TODO: Add parsing for twitter urls to do twitter URL Embedins

    // MarkDown
    input = md(input);

    return input;
};
