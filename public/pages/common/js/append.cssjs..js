var csspath = [
"../../incude/fontAwesome/css/font-awesome.min.css",
"../../incude/slinky/css/slinky.css",
"../../incude/highlight/css/monokai-sublime.css",
"../../incude/stickyHeader/css/header.css",
"../common/css/pages.css"
]


var jspath = [
"../../js/jquery-2.2.3.min.js",
"../../js/rd-smoothscroll.min.js",
"../../incude/greensock/TweenMax.min.js",
"../../incude/slinky/js/slinky.js",
"../../incude/highlight/js/highlight.pack.js",
"../../js/pages.js"
]


for (var i = 0; i < csspath.length; i++) {   

    loadjscssfile(csspath[i], "css", "head");
};



for (var i = 0; i < jspath.length; i++) {  

    loadjscssfile(jspath[i], "js", "html");
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


