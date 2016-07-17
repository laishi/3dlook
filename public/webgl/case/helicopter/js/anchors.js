$('.button').mouseover(function(e) {
    e.preventDefault();
    $(this).parent().toggleClass('expand');
    $(this).parent().children().toggleClass('expand');
});
