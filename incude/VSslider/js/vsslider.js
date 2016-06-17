jQuery(document).ready(function ($) {

    setInterval(function () {
        moveRight();
    }, 6000);
  
	var slideCount = $('.vsslider ul li').length;

	var slideWidth = $('.vsslider ul li').width();
	var slideHeight = $('.vsslider ul li').height();
	var sliderUlWidth = slideCount * slideWidth;
	
	$('.vsslider').css({ width: slideWidth, height: slideHeight });
	
	$('.vsslider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	
    $('.vsslider ul li:last-child').prependTo('.vsslider ul');

    function moveLeft() {
        $('.vsslider ul').animate({
            left: + slideWidth
        }, 200, function () {
            $('.vsslider ul li:last-child').prependTo('.vsslider ul');
            $('.vsslider ul').css('left', '');
        });
    };

    function moveRight() {
        $('.vsslider ul').animate({
            left: - slideWidth
        }, 200, function () {
            $('.vsslider ul li:first-child').appendTo('.vsslider ul');
            $('.vsslider ul').css('left', '');
        });
    };

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });

});