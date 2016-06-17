var csspath = [
"../../incude/fontAwesome/css/font-awesome.min.css",
"../../incude/slinky/css/slinky.css",
"../../incude/mixitup/css/mixitup.css",
"../../incude/highlight/css/default.css",
"../../incude/stickyHeader/css/header.css",
"../../css/pages.css"
]


var jspath = [
"../../js/jquery-2.2.3.min.js",
"../../js/rd-smoothscroll.min.js",
"../../incude/greensock/TweenMax.min.js",
"../../incude/highlight/js/highlight.pack.js",
]

var slinkyJS = [
"../../incude/slinky/js/slinky.js",
"../common/js/share.js",
]


for (var i = 0; i < csspath.length; i++) {   

    loadjscssfile(csspath[i], "css", "head");
};



for (var i = 0; i < jspath.length; i++) {  

    loadjscssfile(jspath[i], "js", "head");
};







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

    
    // FIX IMG PATH
    var findImg = $(".pageCont").find("img");

     findImg.each(function(index,img){

        var sourPath = $(img).attr('src');

        var fixPath = "../../" + sourPath;


        $(img).attr("src",fixPath);  
      });



    for (var i = 0; i < slinkyJS.length; i++) {  

        loadjscssfile(slinkyJS[i], "js", "head");
    };



} 

