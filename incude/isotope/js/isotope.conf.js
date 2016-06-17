$(window).load(function() {

    
    var $container = $('.isotope');


    $('.isotope').isotope({
        layoutMode: 'packery',
        itemSelector: '.isotope-item',
    });

    var item = $('.isotope-item');

    $container.on('click', '.isotope-item', function() {
        // change size of item by toggling big-up class
        $('.isotope-item').removeClass('is-expanded');
        $(this).toggleClass('is-expanded');
        $container.isotope()
    });
    
    $container.on('click', '.isotope-item.is-expanded', function() {
        $(this).removeClass('is-expanded');
        $container.isotope()
    });



    $(".galdshowall").click(function() {
        $container.isotope({
            filter: ''
        });
    });


    $(".galdjzzm").click(function() {
        $container.isotope({
            filter: '.jzzm',
        });
    });

    $(".galdjrds").click(function() {
        $container.isotope({
            filter: '.jrds'
        });
    });

    $(".galdjgzm").click(function() {
        $container.isotope({
            filter: '.jgzm'
        });
    });





});
