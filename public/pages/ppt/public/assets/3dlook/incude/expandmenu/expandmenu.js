/*$(window).ready(function() {

    var n = $(".navitem").length; // Div count
    var OW = 38; // Div over width
    TweenMax.set($(".navitem"), {
        width: 100 / n + '%'
    });
    $(".navitem").hover(over, out);

    function over() {
        TweenMax.to($(this), 0.5, {
            width: OW + '%'
        });
        TweenMax.to($(this).siblings(), 0.5, {
            width: (100 - OW) / (n - 1) + '%'
        })
    }

    function out() {
        TweenMax.to($(".navitem"), 0.5, {
            width: 100 / n + '%',
            ease: Back.easeOut
        })
    }



    var cardcont = $(".card").length;
    var c = $(".infoitem").length / cardcont; // Div count
    var KD = 60; // Div over width
    TweenMax.set($(".infoitem"), {
        width: 100 / c + '%'
    });
    $(".infoitem").hover(over, out);

    function over() {
        TweenMax.to($(this), 0.5, {
            width: KD + '%'
        });
        TweenMax.to($(this).siblings(), 0.5, {
            width: (100 - KD) / (c - 1) + '%'
        })
    }

    function out() {
        TweenMax.to($(".infoitem"), 0.5, {
            width: 100 / c + '%',
            ease: Back.easeOut
        })
    }


});*/





$(document).ready(function() {


	var winTop = $(window).scrollTop();

	console.log(winTop);

	/*alert(Math.random(winTop));*/



	

	/*var cardlw = $('.card').offset().left;*/

	/*alert(cardlw);*/


	   


});



