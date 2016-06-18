

/*EXPAND MENU INIT*/
$(document).ready(function() {

    var navItemL = $(".navItem").length;

    var expandW = 38;
    TweenMax.set($(".navItem"), {
        width: 100 / navItemL + '%'
    });
    $(".navItem").hover(over, out);

    function over() {
        TweenMax.to($(this), 0.8, {
            width: expandW + '%'
        });
        TweenMax.to($(this).siblings(), 0.8, {
            width: (100 - expandW) / (navItemL - 1) + '%'
        })
    }

    function out() {
        TweenMax.to($(".navItem"), 0.8, {
            width: 100 / navItemL + '%',
            ease: Back.easeOut
        })
    }

});



/*EXPAND MENU FILTER INIT*/


$(document).ready(function() {

    var filterItemL = $(".filterItem").length;

    var expandW = 25;


    TweenMax.set($(".filterItem"), {
        width: 100 / filterItemL + '%'
    });

    $(".filterInput").hover(over, out);

    var getLayoutIcon;

    var getIcons;
    
    function over() {


        getIcons = $(this).siblings("#ChangeLayout").children();

        var searchIcon = "<i class='fa fa-search' aria-hidden='true'></i>"

        $(this).siblings("#ChangeLayout").children().remove();

        $(this).siblings("#ChangeLayout").append(searchIcon);

        console.log(getIcons.text())


        TweenMax.to($(this), 0.8, {
            width: 100 -(100 / filterItemL) + '%'
        });

        TweenMax.to($(this).siblings(), 0.8, {
            width: 0 + '%'
        })

        TweenMax.to($(this).siblings().children(), 0.3, {
            scale: 0
        })

        TweenMax.to($(this).siblings().first().children(), 0.3, {
            scale: 1
        })


        $(this).children().attr("placeholder", "");


        // $(".filterAll").children("h3").css("color","#CB0027");

        TweenMax.to($(this).siblings().first(), 0.8, {
            width: 100 / filterItemL + '%'
        })

    }

    function out() {

        $(this).children().attr("placeholder", "搜");

        $("#ChangeLayout").children().remove();
        $("#ChangeLayout").append(getIcons);

        TweenMax.to($(".filterItem"), 0.8, {
            width: 100 / filterItemL + '%',
            ease: Back.easeOut
        })
        TweenMax.to($(".filter").children(), 0.3, {
            scale: 1
        })
    }
});

/*EXPAND BAR INIT*/
$(document).ready(function() {

    var gridItemsCont = $(".work").find(".item").length + $(".blog").find(".item").length;

    var c = $(".barItem").length / gridItemsCont;
    var KD = 50;

    TweenMax.set($(".barItem"), {
        width: 100 / c + '%'
    });
    $(".barItem").hover(over, out);

    function over() {
        TweenMax.to($(this), 0.3, {
            width: KD + '%'
        });
        TweenMax.to($(this).siblings(), 0.3, {
            width: (100 - KD) / (c - 1) + '%'
        })

        // TweenMax.staggerFromTo($(this), 0.3, { y: 0 }, { y: -50, delay:0.3}, 0.2);
    }

    function out() {
        TweenMax.to($(".barItem"), 0.3, {
            width: 100 / c + '%',
            ease: Back.easeOut
        })

        // TweenMax.staggerFromTo($(this), 0.3, { y: -50 }, { y: 0, delay:0.1}, 0.2);
    }

});
