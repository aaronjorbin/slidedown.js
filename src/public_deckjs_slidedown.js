/*!
Slidedown.js for Deck.js
Copyright (c) 2012 Aaron Jorbin 
Dual licensed under the MIT license and GPL license.
https://github.com/aaronjorbin/slidedown.js/blob/master/MIT-license.txt
https://github.com/aaronjorbin/slidedown.js/blob/master/GPL-license.txt
*/
(function($) {
    var container = $('.deck-container');  
    slideDeck = $('.deck-container').children('ul').children('li').each( function(count){
        slidify(this, count);
        // turn into a 
        
    }).parent(function(){ console.log(this); });
    function slidify(li, num) {
        var title = $( li ).find('h1').text().replace(/[\W]/gi, '_').toLowerCase() || $( li ).find('h2').text().replace(/[\W]/gi, '_').toLowerCase() || 'slide_' + num;
        var classes = generateClasses(li, num);
        var content =  $(li).html();
        var section = $('<section></section>').attr('id', title).addClass(classes).addClass($(li).attr('class')).html( content );
        $(li).remove();
        container.append(section); 

    }
    function generateClasses(li, num) {
        var classes = ['slide'];
        var alltxt = $(li).text().replace(/[\W]/gi, '').toLowerCase();
        var h1txt = $(li).find('h1').text().replace(/[\W]/gi, '').toLowerCase();
        var h2txt = $(li).find('h2').text().replace(/[\W]/gi, '').toLowerCase();
        var img  = $(li).find('img');

        // Title slide is the first slide
        if (num == 0)
            classes.push('title');

        // Simplest switch is odd and even
        classes.push( (num % 2 == 0 ) ? 'odd' : 'even' );

        // Divide our slides in thirds
        if (num % 3 == 0)
            classes.push('one-three'); 
        else if (num % 3 == 1)
            classes.push('two-three'); 
        else if (num % 3 == 2)
            classes.push('three-three'); 
                    
        // Apply clases based on the content of the individual slide
        if ( img.length == 0 && (alltxt == h1txt || alltxt == h2txt ) )
            classes.push('only-title');
        else if (img.length == 0 && h1txt && h2txt && alltxt  == ( h1txt +  h2txt  )  )
            classes.push('h1h2');
        else
            classes.push('not-only-title');

        if ( img.length == 0)
            classes.push('no-img');
        else
        {
            classes.push('has-img');
            classes.push('img' + img.length  );
        }
         
            

        return classes.join(' ');
    }
    container.children('ul').remove();
    $.deck('.slide');

})(jQuery)
