module.exports = function( input, config ) {
    // Title
    input = input.replace(/\%\=title\=\%/gi , config.title);

    return input;
};
