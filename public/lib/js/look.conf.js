$(document).ready(function() {


    // var homejs = [

    //     'public/incude/greensock/TweenMax.min.js',
    //     'public/lib/js/expandItem.js',

    //     'public/lib/js/scrollheader.js',
    //     'public/lib/js/sliderPage.js',
    //     'public/lib/js/usedetail.js',
    //     'public/lib/js/scrollgrid.js',

    //     'public/incude/mixitup/js/jquery.mixitup.min.js',
    //     'public/incude/slinky/js/slinkyHome.js',
    //     'public/incude/highlight/js/highlight.pack.js',

    // ]





    // for (var i = 0; i < homejs.length; i++) {  
    //     loadjscssfile(homejs[i], "js", "body");
    // };


function loadjscssfile(filename, filetype, pos) {
    var fileref;

    if (filetype === "js") { //if filename is a external JavaScript file
        fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype === "css") { //if filename is an external CSS file
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }

    if (fileref) {
        document.getElementsByTagName(pos)[0].appendChild(fileref);
    }
}



});