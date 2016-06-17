$(document).ready(function() {

    $(window).on('hashchange', function(e){
        var hashUrl;
        var origEvent = e.originalEvent;

        var urlSplit = origEvent.newURL.split("/");
        var urlLenght = urlSplit.length;

        hashUrl = urlSplit[urlLenght-1];
        sliderPage(hashUrl);

        var hash = new String(document.location).indexOf("#");
    });





    var getTitle=null;
    var getTag=null;













    $(window).scroll(function() {

        var winTop = $(window).scrollTop();

        if (winTop >= 100) {

            TweenMax.to($("header"), 0.3, {height: 60,}, 0.1);

            TweenMax.to($("header").find("img"), 0.3, { scale: 0 } );
            TweenMax.to($("header").find(".tagName"), 0.3, { y: -260 } );

        } else {

            TweenMax.to($("header").find("img"), 0.3, { scale: 1 } );

            TweenMax.to($("header"), 0.3, { height: 320, }, 0.1);
            TweenMax.to($("header").find(".tagName"), 0.3, { y: 0 } );
        }

        if ($("header").hasClass("fixHeader")) {

                console.log(getTitle)
            if (winTop > 370) {                

                $("header").find(".tagName").children().remove();
                $("header").find(".tagName").append(getTitle);
                
            } else {
                $("header").find(".tagName").children().remove();
                $("header").find(".tagName").append(getTag);
            }

            
        }

    });



    var navItem = $(".navItem");
    var page = $(".page");
    var homePage = $(".pages").children().first();

    homePage.addClass("curPage");
    homePage.css({ "display": "block" });

    var lastPage = homePage;
    var curPage = homePage;
    var lastTween, curTween;


    $(".backCicle").click(closeDetail);


    // $(".barMark").click(openDetail);
    // $(".itemTitle").click(openDetail);

    $(".barInfo").click(openInfo);

    $(".barLove").click(function() {
        $(this).children().toggleClass("barToggle");
    })






    var container = $('.container');
    var containerH = container.height();
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











    function sliderPage(pageName,index) {



        var clickNum = 0;
        var clickX = 0;

        var countClick = 0;

        var pageIndex = 0;
        var clickNum = 0;

        var pageData = pageName;
        // var index = index;

        var curPage = $('.' + pageData);
        var curPageSiblings = curPage.siblings();



        if (pageData == "blog") {


            $('.blogMix').mixItUp();

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


                            if ($(this).children('.itemTitle').text().toLowerCase().match(inputText)) {
                                $matching = $matching.add(this);
                            } else if ($(this).children('.itemDes').text().toLowerCase().match(inputText)) {
                                $contText = $contText.add(this);
                            } else {
                                // removes any previously matched item
                                $matching = $matching.not(this);
                            }
                        });



                        $(".blogMix").mixItUp('filter', $matching);
                        // $(".blogMix").mixItUp('filter', $contText);



                    } else {
                        // resets the filter to show all item if input is empty
                        $(".blogMix").mixItUp('filter', 'all');
                    }




                }, 200);
            });

        }




        if (curPage.hasClass("curPage")) {

        } else {

            $(".pages").children().removeClass("lastPage");
            $(".curPage").removeClass("curPage").addClass("lastPage");
            curPage.addClass("curPage");

            lastPage = $(".lastPage");
            curPage = $(".curPage");
            var speed = 0.5;

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
            }


        }
    }





    function gototop() {



        $(".gridItems").css({"display":"none"});



        // SET BTN POS

        if ($(window).innerWidth()>1080) {

            var ld = ((1 - 1080/$(window).innerWidth())/2 - 0.02) *100 + "%" 

        } else {
            var ld = 2 + "%"
        }


        TweenMax.to($(this).parent().siblings(), 0.0, { display: "none" });

        $(".infoMax").css({ display: "block", opacity: 0 });
        $(".backCicle").css({ display: "block" });
        $(".go3dCicle").css({ display: "block" });



        TweenMax.to($(".infoMax"), 0.5, { opacity: 1 });

        TweenMax.fromTo($(".backCicle"), 1.2, { left: $(window).innerWidth() / 2 - 30, scale: 0, opacity: 0 },
                        { left: "5%", scale: 1, opacity: 1, ease: Elastic.easeOut.config(1, 0.75), });

        TweenMax.fromTo($(".go3dCicle"), 1.2, { right: $(window).innerWidth() / 2 - 30, scale: 0, opacity: 0 },
                        { right: "5%", scale: 1, opacity: 1, ease: Elastic.easeOut.config(1, 0.75), });


        $(window).scrollTop(0);
    };






    function openDetail() {


        $("header").addClass("fixHeader");

        $(this).parents(".item").children(".bar").children(".barMark").children().addClass("barToggle");







        if ($(this).parents(".page").hasClass("work")) {
            var pagePath = "pages/work/";
        }
        if ($(this).parents(".page").hasClass("blog")) {
            var pagePath = "pages/blog/";
        }

        var pageName = $.trim( $(this).parents(".item").find(".pageName").text() );
        var pageFormat = ".html";
        var pageURL = pagePath + pageName + pageFormat;
        var pageLoad = pagePath + pageName + pageFormat + " ." + pageName;

        
        $(".detailDes").load(pageLoad);










    }


    function closeDetail() {


        $(".gridItems").css({"display":"block"});



        $("header").removeClass("fixHeader");






        $(".headerCont").children().remove();

        $(".detailTag").children().remove();
        $(".detailTitle").children().remove();
        $(".detailDes").children().remove();
        $(".detail3d").children().remove();
        $(".detailAdditional").children().remove();
        



        $(".headerCont").append(getHeaderCont);




        TweenMax.fromTo($(".navGrid"), 1.2, { y: 60, opacity: 0 }, { y: 0, opacity: 1 });


        TweenMax.set($(".backCicle"), { display: "none" });
        TweenMax.set($(".go3dCicle"), { display: "none" });

        $(".infoMax").css({ display: "none", opacity: 1 });


        TweenMax.staggerTo($(".item"), 0.5, {
            scale: 1,
            cycle: {
                delay: function(index) {
                    return Math.random(index) / 10;
                }
            },
        }, 0.01);

        function killItem() {
            alert("killItem");
        }


        TweenMax.to($(".itme"), 0.0, { display: "none", delay: 0.5 });

    }





    function openInfo() {

        if ($(this).children().hasClass("barToggle")) {

            $(this).parent().siblings(".info").css("display", "none");
            TweenMax.to($(this).parent().siblings(".info").children(), 0.3, { opacity: 1 });
            TweenMax.to($(this).parent().siblings(".itemImg"), 0.5, { ease: Elastic.easeOut.config(1, 0.75), scale: 1, delay: 0.3 });
            $(this).children().toggleClass("barToggle");
            $(this).children().children("i").removeClass("fa-close").addClass("fa-info");


            TweenMax.to($(this).parents(".item").children(".bar").find(".infoTitle"), 0.5, { ease: Elastic.easeOut.config(1, 0.75), opacity: 0, delay: 0.3 });




        } else {

            $(this).parent().siblings(".info").css("display", "block");
            TweenMax.to($(this).parent().siblings(".itemImg"), 0.3, { ease: Power1.easeIn, scale: 0, delay: 0.0 });

            TweenMax.staggerFromTo($(this).parent().siblings(".info").children(), 0.3, { y: 320 }, { y: 0 }, 0.2);
            TweenMax.staggerFromTo($(this).parent().siblings(".info").children(), 0.3, { opacity: 0 }, { opacity: 1 }, 0.2);

            $(this).children().toggleClass("barToggle");
            $(this).children().children("i").removeClass("fa-info").addClass("fa-close");

            //SET INFOCONT DIV HEIGHT
            var itemH = $(this).parent().parent().height();
            var titleH = $(this).parent().siblings(".info").children(".infoTitle").height();

            var infoContH = itemH - titleH - 100;

            $(this).parent().siblings(".info").children(".infoCont").css("height", infoContH);
        }
    }





});