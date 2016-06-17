var slideNumber = 0, // current slide. visible slide
    nextSlide = 1, // next slide

    wrapper = $("#slider-wrapper"),

    menuLi = $("#menu li"),

    // slides
    slides = $(".slide"),
    totalSlides = slides.length,

    pauseTime = 5,
    duration = 1.2,


    timerFunction = TweenMax.delayedCall(pauseTime, changeSlide),

    slideAnimating = false;



TweenMax.set(slides.not(":eq(0)"), { left: "100%" });

//TweenMax.set(menuLi[0], { backgroundColor: "#222" });




function changeSlide() {

    slideAnimating = true;

    TweenMax.to(slides[slideNumber], duration, {
        left: "-100%",
        onComplete: function() {

                slideAnimating = false;
                timerFunction.restart(true);

                if (wrapper.hasClass("mouse-over")) {
                    timerFunction.pause();
                }

                TweenMax.set(this.target, { left: "100%" });
            } 
    });


    

    // NEXT SLIDE ANIMATION START
    TweenMax.to(slides[nextSlide], duration, {
        left: "0"
    });

    // 
    if (nextSlide < totalSlides - 1) {
        // set the index of the slide that will be animated-out in the next execution
        slideNumber = nextSlide;

        // set the index of the slide that will be animated-in in hte next execution
        nextSlide++;
    } else {
        // set the index of the slide that will be animated-out in the next execution
        slideNumber = nextSlide;
        // if the visible slide is the last one set the index for the slide that will be animated-in to 0, that means the first slide
        nextSlide = 0;
    }

}














/*
---------------------------------------------------
    MOUSE OVER AND OUT EVENTS
---------------------------------------------------
*/
// in order to check if the mouse is over when the slide is animating add a class to the container.

var menu = $("#menu");
var menuChild = $("#menu").children();







wrapper.hover(function(e) {
    console.log(e.type)

    if (e.type == "mouseenter") {

        TweenMax.set(this, { className: "+=mouse-over" });
        timerFunction.pause();


        TweenMax.staggerFromTo(menuChild, 0.6, {y:-500}, {y:420}, 0.1);

        // = TweenMax.staggerFrom(menuChild, 1, {y:200}, 0.1);

    } else {

        TweenMax.set(this, { className: "-=mouse-over" });
        timerFunction.play();

        TweenMax.staggerFromTo(menuChild, 0.6, {y:420}, {y:-500}, 0.1);

    }


    

});



















/*
---------------------------------------------------
        MENU ITEM CLICK EVENT
---------------------------------------------------
*/







$.each(menuLi, function(i, e) {
    var hoverLine = new TimelineLite({ paused: true });

    hoverLine.to(e, .3, { backgroundColor: "#ccc" });

    e.hoverLine = hoverLine;
});






menuLi.click(function(e) {
    console.log(slideAnimating);

    // get the button being clicked index position. this will be set as the slide to be animated.
    var btnIndex = menuLi.index(this);

    // if there's no slide animating pause the timer function. select the button's index and set the slide number according to it. call the function to animate in the corresponding slide and finally restart the timer fuction to cntinue with the autoplay feature. also avoid executing the function if the user clicks on the button corresponding to the currently visible slide
    if (!slideAnimating && btnIndex !== slideNumber) {
        // pause the timer function. with this avoid the slide being animated out too soon. if the timer has advanced for some time the slider being animated-in by the click event, will be visible for less time than the expected. unwanted behaviour. the timer function will be restarted in the change slide function so the pause time between slides animations will be the usual one.
        timerFunction.pause();

        // set the correct index to show the slide corresponding to the button being clicked. otherwise the slide animated in will be the next one sequentially and not necesarly the one indicated by the button's index position
        nextSlide = btnIndex;

        // call the function to change animate the slides
        changeSlide();
    }
})



// hover event for menu items
menuLi.mouseover(function(e) {
    this.hoverLine.play();
})


menuLi.mouseout(function(e) {
    this.hoverLine.reverse();
});







