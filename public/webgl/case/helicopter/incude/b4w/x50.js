"use strict"

// register the application module
b4w.register("X50", function(exports, require) {

// import modules used by the app
var m_anim      = require("animation");
var m_app       = require("app");
var m_data      = require("data");
var m_scenes    = require("scenes");


/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "render",
        callback: init_cb,
        show_fps: true,
        console_verbose: true,
        autoresize: true
    });
}

/**
 * callback executed when the app is initizalized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    /*canvas_elem.addEventListener("mousedown", main_canvas_click, false);*/

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("assets/obj/hz.json", load_cb);
}

/**
 * callback executed when the scene is loaded
 */
function load_cb(data_id) {
    m_app.enable_controls();
    m_app.enable_camera_controls();

    // place your code here

}



});

// import the app module and start the app by calling the init method
b4w.require("X50").init();
