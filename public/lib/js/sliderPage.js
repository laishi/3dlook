
var wURL = window.location.href.split("/");
var wURLADD = wURL[wURL.length - 1];


var firstBlog = 1;

window.onload = function() {

    var winUrl = window.location.href.split("/");

    var winUrlLength = winUrl.length ;

    var winUrlName = winUrl[winUrlLength - 1] ;

    // alert(winUrlName)



    setTimeout(function(){

        sliderPage(winUrlName, 0.3, 1);

    },300); 

    setTimeout(function(){

        if (winUrlName === "blog" && firstBlog == 1) {
            mixConf();
            firstBlog = 0;
        }

    },300); 





} 


$(window).on('hashchange', function(e){

    var origEvent  = e.originalEvent;

    var CurURL     = origEvent.newURL;
    var urlSplit   = CurURL.split("/");
    var urlLenght  = urlSplit.length;
    var curUrlName = urlSplit[urlLenght-1];

    var oldURL     = origEvent.oldURL;
    var OurlSplit  = oldURL.split("/");
    var OurlLenght = OurlSplit.length;

    oldUrlName = OurlSplit[OurlLenght-2];


    GURLNAME = curUrlName;

    // console.log(oldUrlName + " " + "oldUrlName");
    // console.log(curUrlName + " " + "curUrlName");

    sliderPage(curUrlName, 0.5, -1);

    if (oldUrlName == "detail") {
        closeDetail();
    }



});





$(".navItem").click(function() {

    var pageData = $(this).data("page");
    var index = $(this).index();

    var curPage = $('.' + pageData);

    CURPAGE = curPage;

    sliderPage(pageData, 0.5, index);

    $(".work .gridItems").css({"height":0, "overflow": "hidden"});

    if (pageData === "blog" && firstBlog == 1) {
        mixConf();
        firstBlog = 0;
    }

    // if (pageData === "about") {
    //   $(".wxewm").css({"display":"block"});
    //   $(".wxewm").siblings() .css({"display":"none"});
    // } else {
    //   $(".wxewm").css({"display":"none"});
    //   $(".wxewm").siblings() .css({"display":"block"});
    // }
});



var pageIndex = 0;
var clickNum = 0;

var page = $(".page");
var homePage = $(".pages").children().first();

homePage.addClass("curPage");
homePage.css({ "display": "block" });

function sliderPage(pageName,speed,index) {


    var pageData = pageName;
    // var index = index;

    var curPage = $('.' + pageName);
    var curPageSiblings = curPage.siblings();

    curPage.css({"display":"block"});

    if (curPage.hasClass("curPage")) {



    } else {

        $(".pages").children().removeClass("lastPage");
        $(".curPage").removeClass("curPage").addClass("lastPage");
        curPage.addClass("curPage");

        lastPage = $(".lastPage");
        curPage = $(".curPage");



        if (pageIndex < index) {
            goRight();
        } else {
            goLeft();
        }

        pageIndex = index;

        clickNum++;

        function goRight() {
            TweenMax.fromTo(lastPage, speed, { x: "0%" }, { x: "-100%" });
            TweenMax.fromTo(curPage, speed, { x: "100%" }, { x: "0%", onComplete:wtotop });
        }

        function goLeft() {
            TweenMax.fromTo(curPage, speed, { x: "-100%" }, { x: "0%" });
            TweenMax.fromTo(lastPage, speed, { x: "0%" }, { x: "100%", onComplete:wtotop });
        }

        function wtotop() {
            $(window).scrollTop(0);
            $(".curPage").siblings().css({"display":"none"});

        }
    }
}








function mixConf() {

    $(".markMix").siblings().css({"opacity":0})

    var layout = 'grid',
        $container = $('.blogMix'),
        $changeLayout = $('#ChangeLayout');



    $container.mixItUp({
        callbacks: {
            onMixStart: function(state, futureState){


            },

            onMixEnd: function(state){

            }

        },
        animation: {
            animateChangeLayout: true,
            animateResizeTargets: true,
            // effects: 'fade scale '
        },
        layout: {
            containerClass: 'grid'
        }
    });


    $changeLayout.on('click', function() {


        if (layout == 'list') {

            $(".itemTotal").toggleClass("repos");
            $(".blogImg").toggleClass("img320");

            layout = 'grid';
            $(".itemDes").css({"display":"none"});
            $changeLayout.html("<i class='fa fa-bars' aria-hidden='true'></i>");
            $container.mixItUp('changeLayout', {
                containerClass: layout
            });

        } else {

            // TweenMax.to($(".blogImg"), 0.2, {"width":"320px"});

            $(".itemTotal").toggleClass("repos");

            layout = 'list';

            $(".itemDes").css({"display":"block"});

            $changeLayout.html("<i class='fa fa-th' aria-hidden='true'></i>");
            $container.mixItUp('changeLayout', {
                containerClass: layout
            });
        }

    });



    var inputText;
    var $matching = $();
    var $contText = $();

    // Delay function
    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $("#input").keyup(function() {
        delay(function() {
            inputText = $("#input").val().toLowerCase();

            if ((inputText.length) > 0) {
                $('.mix').each(function() {
                    $this = $("this");


                    if ($(this).children().children('.itemTitle').text().toLowerCase().match(inputText)) {
                        $matching = $matching.add(this);
                    } else if ($(this).children().children('.itemTitle').text().toLowerCase().match(inputText)) {
                        $contText = $contText.add(this);
                    } else {
                        // removes any previously matched item
                        $matching = $matching.not(this);
                    }
                });

                $(".blogMix").mixItUp('filter', $matching);

            } else {
                // resets the filter to show all item if input is empty
                $(".blogMix").mixItUp('filter', 'all');
            }
        }, 200);
    });

}
