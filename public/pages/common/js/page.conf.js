var csspath = [
"../../incude/fontAwesome/css/font-awesome.min.css",
"../../incude/slinky/css/slinky.css",
"../../incude/mixitup/css/mixitup.css",
"../../incude/highlight/css/default.css",
"../../incude/stickyHeader/css/header.css",
]

var jspath = [
"../../incude/greensock/TweenMax.min.js",
"../../lib/js/rd-smoothscroll.min.js",
"../../incude/highlight/js/highlight.pack.js",
]

var slinkyJS = [
"../../incude/slinky/js/slinky.js",
"../common/js/share.js",
]


$(document).ready(function() {



    for (var i = 0; i < csspath.length; i++) {   
        loadjscssfile(csspath[i], "css", "head");
    };

    for (var i = 0; i < jspath.length; i++) {  
        loadjscssfile(jspath[i], "js", "body");
    };


    var pageLoader =
    "<div class='pageLoader'>" +
        "<div class='loaderWrap'>" +
            "<div class='loader'></div>" +
            "<div class='loader'></div>" +
            "<div class='loader'></div>" +
            "<div class='loader'></div>" +
        "</div>" +
    "</div>";


    $(".pageTitle").append(pageLoader);


    var host = window.location.host;

    $("body").find("img").each(function(index,img){

        var sourPath = $(img).attr('src');

        var fixPath = "http://" + host + "/" + sourPath;

        $(img).attr("src",fixPath);  
    });



    $('script').load(function () {

        TweenMax.to($(".pageTitle"), 0.5, {"height":"320px", ease: Power3.easeOut, onComplete: loadAfter});
        TweenMax.to($(".pageLoader"),0.3,{"scale":0, ease: Power3.easeOut});
    }); 

});











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


window.onload = function() {

    $('pre code')
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
 

    for (var i = 0; i < slinkyJS.length; i++) {  
        loadjscssfile(slinkyJS[i], "js", "body");
    };

} 




function loadAfter() {

    $(".pageLoader").css({"display":"none"});
    TweenMax.fromTo($(".pageCont"),2.3,{"opacity":0},{"opacity":1});
    TweenMax.fromTo($(".goHome"),0.3,{"opacity":0},{"opacity":1});

}