var wWidth = window.innerWidth;
var wHeight = window.innerHeight;





Reveal.initialize({

    width: wWidth,
    height: wHeight,
    margin: 0.1,


    controls: true,
    progress: true,
    history: true,
    center: true,
    mouseWheel: true,

    transition: 'slide', // none/fade/slide/convex/concave/zoom






    menu: {

            side: 'left', 
            numbers: true,
            titleSelector: 'h1',
            hideMissingTitles: false,
            markers: false,
            custom: false,
            themes:false,
            transitions: true,
            openButton: true,
            openSlideNumber: false,
            keyboard: true
        },




    // Optional reveal.js plugins
    dependencies: [
        { src: 'lib/js/classList.js', condition: function() {
                return !document.body.classList; } },
        { src: 'plugin/markdown/marked.js', condition: function() {
                return !!document.querySelector('[data-markdown]'); } },
        { src: 'plugin/markdown/markdown.js', condition: function() {
                return !!document.querySelector('[data-markdown]'); } },
        { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: 'plugin/zoom-js/zoom.js', async: true },
        { src: 'plugin/notes/notes.js', async: true },
        { src: 'plugin/extension/menu/reveal.js-menu-master/menu.js', async: true },

    ]
});

window.addEventListener("resize", wResize);

function wResize() {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

    Reveal.initialize({
        width: wWidth,
        height: wHeight,
    });
}


// $( document ).ready(function() {
    
//     var iframe3d = $( ".case3d").children(".iframe" );
//     iframe3d.css( { "width":"100vw"; "height":"80vh"} );
// });


