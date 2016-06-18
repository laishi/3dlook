$(document).ready(function() {

    var X50Main = $(".X50Main");

    var x50drawing = $("#x50drawing");
    var x50Render = $("#x50Render");


    var uiItems = $(".uiItems");
    var uiMenu = $(".uiMenu");
    var uiMenuChange = $(".uiMenuChange");
    var uiItem = $(".uiItem");
    var uiItemCont = $(".uiItemCont");
    var renderCanvas = $(".renderCanvas");

    var itemInfo = $(".itemInfo");
    var contentItem = $(".contentItem");


    var waveBtn = $(".waveBtn");
    var w = $(window);
    var vw = w.innerWidth();
    var vh = w.innerHeight();
    var bw = waveBtn.innerWidth();
    var bh = waveBtn.innerHeight();
    var scale;



    if (vw > vh) {
        s = vw / bw * 1.5;
    } else {
        s = vh / bh * 1.5;
    }

    scale = 'scale(' + s + ') translate(-50%,-50%)';



    //WINDOW LOAD RUN ANIMATION

    var n = uiItem.length; 
    var OW = 100 / n + 15;
    TweenMax.set(uiItem, { width: 100 / n + '%' });
    var uiItemW = uiItem.width();
    uiItem.hover(over, out);
    function over() {
        TweenMax.to($(this), 0.6, { width: OW + '%' });
        TweenMax.to($(this).siblings(), 0.6, { width: (100 - OW) / (n - 1) + '%' });
    }

    function out() {
        TweenMax.to(uiItem, 0.3, { width: 100 / n + '%', ease: Back.easeOut });

    }




    var uiMenuIcon = uiMenu.children("i");


    function loadedAnim() {

        uiMenuIcon.removeClass("lf-menu").addClass("lf-close");
        uiItems.css({ "display": "block", "z-index": "1" });
        X50Main.css({ "display": "none" });

        TweenMax.to(uiItems, 1.2, { opacity: 1 });

        TweenMax.staggerFrom(uiItem, 3.0, { left: 1000, ease: Elastic.easeOut.config(1.2, 1.0) }, 0.1);
        TweenMax.staggerFrom(uiItemCont, 1.0, { left: 2000 }, 0.2);
        TweenMax.staggerFrom(uiItemCont, 1.0, { transform: "scale(0)", delay: 0.5 }, 0.1);
    }


    function quitAnim() {

        uiMenuIcon.removeClass("lf-close").addClass("lf-menu");

		TweenMax.to(uiItems, 0.6, { opacity: 0, onComplete: toHome });

		function toHome() {			
	        uiItems.css("display", "none");
	        X50Main.css({ "display": "block" });
	        TweenMax.from(X50Main, 1.2, { opacity: 0 });
		}
    }

    // APPEND PROGRESSWAVE

    var uiItemContCur;
    var uiMenuR;

    uiMenu.click(function() {

        uiItem.hover(over, out);
        uiItem.bind();

        uiItemCont.css("display", "block");   

        if ($(this).hasClass("uiMenuR")) {

            if (uiMenuIcon.hasClass("lf-back")) {
                uiMenuIcon.removeClass("lf-back").addClass("lf-close");
            }


            uiItemContCur.css({
                "width": "250px",
                "height": "250px",
                "top": "50%",
                "border-radius": "50%",
                "background-color": "#631876",
            });

            $(".infoTextM").css({ "margin-top": "0px" });
            $(".infoTextL").css({ "display": "none", opacity:0 });
            $(".infoTextR").css({ "display": "none", opacity:0 });


            TweenMax.to(uiItemCont, 0.8, { top: "50%" });
            waveBtn.children().css({
                display: "block",
                opacity: 1.0,
            });

            x50drawing.css({ display: "none", });
            x50Render.css({ display: "none", });

            TweenMax.set(uiItemCont, { "pointer-events": "all" });

            TweenMax.to(contentItem, 0.2,{ display: "none", opacity: 0.0});

            // CLOSE INTEMINFO
            TweenMax.to(uiItemCont.siblings(".itemInfo"), 1, { top: "50%" })
            TweenMax.to(uiItemCont.siblings(".itemInfo").children(".infoDesAll"), 0.2, { display: "block", opacity: 0 });

            waveBtnClose(waveBtn);

            TweenMax.to(uiItem, 1.2, { width: 100 / n + "%", opacity: 1, delay: 0.0, ease: Elastic.easeOut.config(0.5, 0.5) });

            TweenMax.staggerTo(uiItemCont, 1.0, { opacity: 1.0 });


            TweenMax.staggerFrom(uiItemCont, 1.0, { left: 2000 });

            TweenMax.staggerTo(uiItemCont, 1.0, { transform: "scale(1)", delay: 0.5 }, 0.1);



            $(this).removeClass("uiMenuR");


        } else {


            if (uiMenuIcon.hasClass("lf-close")) {
            	quitAnim();
            } else {
                loadedAnim();
            }
        }
    })









    uiItemCont.click(function() {

        uiItemContCur = $(this);
        var uiItemP = $(this).parent();
        var uiItemPS = $(this).parent().siblings();
        var uiItemPSC = uiItemPS.children(".uiItemCont");
        var waveBtn = $(this).children(".waveBtn");
        var expandW = 100;

        uiItemP.addClass("uiItemActive");
        uiItemPS.removeClass("uiItemActive");

        if (uiMenuIcon.hasClass("lf-close")) {
            uiMenuIcon.removeClass("lf-close").addClass("lf-back");
        }

        if (uiItemContCur.hasClass("x50drawingCan")) {
            b4w.require("x50drawing", "inst_1").init("x50drawing");

            uiItemContCur.removeClass("x50drawingCan");
        }



        TweenMax.to(uiItemP, 0.6, { width: expandW + '%' });
        TweenMax.to(uiItemPSC, 0.3, { opacity: 0.0, transform: "scale(0)" });

        TweenMax.to(uiItemPS, 0.6, { width: (100 - expandW) / (n - 1) + '%', onComplete: uiItemPCompleteHandler });



        function uiItemPCompleteHandler() {
            uiItem.unbind();
            uiMenuChange.addClass("uiMenuR");
            x50drawing.css({
                position: "absolute",
                display: "block",
                top: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                "z-index": 1,
                backgroundColor:"#fff"
            });
            TweenMax.to(x50drawing, 1.2, { opacity: 1 });

            x50Render.css({
                position: "absolute",
                display: "block",
                top: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                "z-index": 1,
            });

            TweenMax.to(x50Render, 1.2, { opacity: 1 });
            TweenMax.set(uiItemCont, { "pointer-events": "none" });

            waveBtnOpen(waveBtn, scale);

            TweenMax.to(uiItemContCur, 1.3, { "top": "100vh", delay: 0.8, ease: Back.easeOut.config(1.7), onComplete: showInfo });

            TweenMax.to($(".infoTextM"), 0.3, { "margin-top": "-32px" });

            TweenMax.to(contentItem, 2.0,{ display: "block", opacity: 1.0, delay: 1.0});
            //TweenMax.from(contentItem.children(), 0.2, { opacity: 0.0, delay: 0.1 });

            function showInfo() {
	            TweenMax.to($(".infoTextL"), 0.6, { "display": "block", opacity:1 });
	            TweenMax.to($(".infoTextR"), 0.6, { "display": "block", opacity:1 });

            }


        }

    });






    function waveBtnOpen(waveBtn, scale) {
        waveBtn.children().css({
            display: "none",
            opacity: 0,
        });
        waveBtn.css({
            transform: scale,
            opacity: 0,
        });
    }


    function waveBtnClose(waveBtn) {

        waveBtn.removeAttr('style');
    }


})
