$(window).load(function() {

    var gridItemsH = $(document).height() - $(window).height() - 520;
    $(".work .gridItems").css({"height":gridItemsH});
    TweenMax.set($(".work .gridItems"), {"overflow":"hidden"});

});








$(document).ready(function() {


    var item = $('.scrollItem');
    var itemL = $('.scrollItem').length;

    var itemNum = Math.floor(1 / (item.width() / window.innerWidth));

    var itemPY = item.offset().top;
    var scrollY = $(window).scrollTop();
    var curentItemPY = itemPY - scrollY;
    var lastScrollTop = 0;  


    $(window).scroll(function() {



        curentItemPY = itemPY - $(window).scrollTop();
        itemNum = Math.floor(1 / (item.width() / window.innerWidth));
        var gridDelay = 0.001;
        var tween;

        st = $(this).scrollTop();

        if (st > lastScrollTop) {

            tween = TweenMax.staggerTo(item, 0.3, {
                y: -st,
                cycle: {
                    delay: function(index) {
                        return index % 2 / 20;
                    }
                }
            }, gridDelay);

        } else {

            tween = TweenMax.staggerTo(item.toArray().reverse(), 0.3, {
                y: curentItemPY - 520,
                cycle: {
                    delay: function(index) {
                        return index % 2 / 20;
                    }
                }
            }, gridDelay);
        }

        lastScrollTop = st;

    });


});