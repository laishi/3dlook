
$(document).ready(function() {


    $('pre code')
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });



    // var winTop = 0;

    // $(window).scroll(function() {

    //     winTop = $(window).scrollTop();

    //     if (winTop >= 100) {

    //         TweenMax.to($("header"), 0.3, {height: 60,}, 0.1);

    //         TweenMax.to($("header").find(".gridImg"), 0.3, { scale: 0 } );
    //         TweenMax.to($("header").find(".tagTitle"), 0.3, { y: -260 } );

    //     } else {

    //         TweenMax.to($("header").find(".gridImg"), 0.3, { scale: 1 } );

    //         TweenMax.to($("header"), 0.3, { height: 320, }, 0.1);
    //         TweenMax.to($("header").find(".tagTitle"), 0.3, { y: 0 } );
    //     }
    // });

});
