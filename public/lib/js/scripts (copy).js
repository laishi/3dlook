
$(window).on('hashchange', function(e){
    var hashUrl;
    var origEvent = e.originalEvent;

    var urlSplit = origEvent.newURL.split("/");
    var urlLenght = urlSplit.length;

    hashUrl = urlSplit[urlLenght-1];
    sliderPage(hashUrl);

    var hash = new String(document.location).indexOf("#");
    // console.log(origEvent)
});


$(".navItem").click(function() {
    var pageData = $(this).data("page");

    var index = $(this).index();

    sliderPage(pageData,index);    
    countClick += 1;
});


// function ChangeUrl(page, url) {
//     if (typeof(history.pushState) != "undefined") {
//         var obj = { Page: page, Url: url };
//         history.pushState(obj, obj.Page, obj.Url);
//     } else {
//         window.location.href = "homePage";
//     }
// }

// ChangeUrl(pageData, pageData);





var clickNum = 0;
var clickX = 0;

var countClick = 0;

var pageIndex = 0;
var clickNum = 0;

function sliderPage(pageName,index) {


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












$(document).ready(function() {





    $(window).scroll(function() {

        var winTop = $(window).scrollTop();

        if (winTop >= 100) {

            TweenMax.to($("header"), 0.3, {height: 60,}, 0.1);

            // TweenMax.to($("header"), 0.3, { height: 60, onComplete:hiddenimg} );
            TweenMax.to($("header").find("img"), 0.3, { scale: 0 } );
            TweenMax.to($("header").children("ul"), 0.3, { y: -270 } );


        } else {

            TweenMax.to($("header"), 0.3, { height: 320, }, 0.1);

            TweenMax.to($("header").find("img"), 0.3, { scale: 1 } );
            TweenMax.to($("header").children("ul"), 0.3, { y: 0 } );

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










    //UPDATE ITEM IMG

    function updateData() {

        var imgPath = "img/workimg/";

        var pageTag = $(".item").find(".pageTag");

        var imgFormat = ".png";

        pageTag.each(function (index, element) {

            var imgName = $(element).text();
            var imgURL = imgPath + imgName + imgFormat;
            var changeImg = $(element).parents(".item").find(".itemImg");
            changeImg.children().prop('src', imgURL);

        })       

    }


    updateData();













})





//grids


$(document).ready(function() {


    $(".backCicle").click(closeDetail);

    $(".item").children(".itemImg").click(openDetail);

    $(".barMark").click(openDetail);
    $(".itemTitle").click(openDetail);

    $(".barInfo").click(openInfo);

    $(".barLove").click(function() {
        $(this).children().toggleClass("barToggle");
    })







    var container = $('.container');
    var containerH = container.height();
    var item = $('.scrollItem');
    var itemL = $('.scrollItem').length;



    var itemNum = Math.floor(1 / (item.width() / window.innerWidth));



    function addMark() {

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







    function openDetail() {




        $("header").addClass("fixHeader");

        $(this).parents(".item").children(".bar").children(".barMark").children().addClass("barToggle");




        TweenMax.staggerTo($(".item"), 0.3, {
            scale: 0,
            cycle: {
                delay: function(index) {
                    return Math.random(index) / 10;
                }
            },
            onComplete: gototop
        }, 0.01);




        TweenMax.fromTo($(".navGrid"), 0.3, { y: 0 }, { y: 60 });


        function gototop() {

            if ($(window).innerWidth()>1080) {

                var ld = ((1 - 1080/$(window).innerWidth())/2 - 0.02) *100 + "%" 

                // alert(mydis);

            } else {
                var ld = 2 + "%"
            }


            TweenMax.to($(this).parent().siblings(), 0.0, { display: "none" });

            $(".infoMax").css({ display: "block", opacity: 0 });
            $(".backCicle").css({ display: "block" });



            TweenMax.to($(".infoMax"), 3.2, { opacity: 1 });

            TweenMax.fromTo($(".backCicle"), 1.2, { left: $(window).innerWidth() / 2 - 30, scale: 0, opacity: 0 },
                            { left: ld, scale: 1, opacity: 1, ease: Elastic.easeOut.config(1, 0.75), });

            TweenMax.fromTo($(".go3dCicle"), 1.2, { right: $(window).innerWidth() / 2 - 30, scale: 0, opacity: 0 },
                            { right: ld, scale: 1, opacity: 1, ease: Elastic.easeOut.config(1, 0.75), });


            $(window).scrollTop(0);
        }











        //GET ITEM DATA

        var getImg = $(this).parents(".item").children(".itemImg").html();
        var getTag = $(this).parents(".item").children(".itemTag").html();
        var getTitle = $(this).parents(".item").children(".itemTitle").html();
        var getDes = $(this).parents(".item").children(".itemDes").html();
        var getAdditional = $(this).parents(".item").children(".itemAdditional").html();




        //CHANGE 3D LINK

        var getLink = $(this).parents(".item").children(".bar").find(".3dlink").attr("href");



        if (getLink) {
            $(".go3dCicleLink").attr("href", getLink);
            TweenMax.to($(".go3dCicle"), 0.0, { display: "block", delay: 0.5 });
        }



        $(".headereyes").remove();
        $("header").children("a").remove();
        $(".detailTag").children().remove();


        $(".detailTitle").children().remove();
        $(".detailDes").children().remove();
        $(".detail3d").children().remove();
        $(".detailAdditional").children().remove();


        $("header").append(getImg);
        $("header").append(getTag);

        $(".detailTitle").append(getTitle);
        // $(".detailDes").append(getDes);
        $(".detailAdditional").append(getAdditional);







        var pagePath = "pages/";

        var pageName = $(this).parents(".item").children(".itemTag").find(".pageTag").text();
        var pageFormat = ".html";
        var pageURL = pagePath + pageName + pageFormat;
        var pageLoad = pagePath + pageName + pageFormat + " ." + pageName;

        console.log(pageURL)

        $(".detailDes").load(pageLoad);













        // ADD IMG GO TO 3D LOOK

        $("header").children("img").wrap($('<a>', {
            href: getLink
        }));

        var iframego = "<iframe src= " + getLink + " " + "frameBorder=0 scrolling=no width='100%' height='100%'></iframe>"





        TweenMax.fromTo($("header").find("img"), 1.2, { y: 320 }, { y: 0, delay: 1, ease: Elastic.easeOut.config(1, 0.75), onComplete: showIframe });
        TweenMax.fromTo($("header").children("ul"), 1.2, { opacity: 0 }, { opacity: 1, delay: 1.2 });


        function showIframe() {
            $(".detail3d").append(iframego);
        }




        $(window).scroll(function() {

            if ($(".detailTitle h3").position().top - $(window).scrollTop() < -350) {

                $("header").children("ul").children().remove();
                $("header").children("ul").append(getTitle);
            } else {
                $("header").children("ul").children().remove();
                $("header").children("ul").append(getTag);
            }
        });

    }





    // closeDetail
    var headereyes = $(".headerCont").html();

    function closeDetail() {


        $("header").removeClass("fixHeader");

        $("header").children("a").remove();
        $("header").children("ul").remove();
        $("header").children(".headereyes").remove();
        $("header").append(headereyes);

        $(".navGrid").css({ display: "block" });

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



    // SCROLL GRID DOWN UP

    var itemPY = item.offset().top;
    var scrollY = $(window).scrollTop();
    var curentItemPY = itemPY - scrollY;
    var lastScrollTop = 0;




    /*
        for (var i = itemGrid.length - 1; i >= 0; i--) {
            itemGrid[i]
        }

    */



    item.each(function(index, element) {

        var thisis = $(this);

        var eachItemTop = thisis.offset().top;

        var winH = $(window).innerHeight() - itemPY;


        if (eachItemTop < eachItemTop) {

            thisis.css("widht", "20px");

        }


    })


    $(window).scroll(function() {

        curentItemPY = itemPY - $(window).scrollTop();

        itemNum = Math.floor(1 / (item.width() / window.innerWidth));

        var gridDelay = 0.001;

        var tween;








        console.log($(document).height())

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

/*EXPAND MENU INIT*/
$(document).ready(function() {

    var filterItemL = $(".filterItem").length;

    var expandW = 25;


    TweenMax.set($(".filterItem"), {
        width: 100 / filterItemL + '%'
    });

    $(".filterItem").hover(over, out);

    function over() {


        if ($(this).hasClass("filterInput")) {


            TweenMax.to($(this), 0.8, {
                width: 75 + '%'
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

            $(".filterAll").html("搜索标题");

            // $(".filterAll").children("h3").css("color","#CB0027");

            TweenMax.to($(this).siblings().first(), 0.8, {
                width: 25 + '%'
            })


        } else {


            TweenMax.to($(this), 0.8, {
                width: expandW + '%'
            });
            TweenMax.to($(this).siblings(), 0.8, {
                width: (100 - expandW) / (filterItemL - 1) + '%'
            })            
        }



    }

    function out() {


        $(".filterAll").html("显示全部");


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

    var gridItemsCont = $(".gridItems").children(".item").length;
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
