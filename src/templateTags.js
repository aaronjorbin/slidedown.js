/*!
* Parse content for Template Tags.  
* Passing content returns content that we realy want to use
*/

var  md =  require("marked");

module.exports = function( input, config , skipMD ) {

    // Title
    input = input.replace(/\%\=title\=\%/gi , config.title);
    // Google Analytics ID
    input = input.replace(/\%\=ga\=\%/gi , config.ga);

    // Twitter Embends
    // @TODO: Add parsing for twitter urls to do twitter URL Embedins

    // MarkDown
    if (skipMD !== true)
        input = md(input);

    return input;
};
