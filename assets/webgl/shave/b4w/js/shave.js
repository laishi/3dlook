"use strict"

// register the application module
b4w.register("shave", function(exports, require) {

// import modules used by the app
var m_app   = require("app");
var m_data  = require("data");

var m_scs   = require("scenes");
var m_tra   = require("transform");
var m_obj   = require("objects");


var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var Body, mirBody, halfBody ;






/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: false,
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

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("b4w/obj/shave.json", load_cb);
}

/**
 * callback executed when the scene is loaded
 */
function load_cb(data_id) {
    m_app.enable_controls();
    m_app.enable_camera_controls();    

    // place your code here


/*    Body = m_scs.get_object_by_name("Body");

    mirBody = m_obj.copy(Body, "halfBody", true);

    m_scs.append_object(mirBody);

    halfBody = m_scs.get_object_by_name("halfBody");

    console.log(halfBody);


    m_tra.set_scale(halfBody, -1);
*/







    document.addEventListener( 'mousemove', onDocumentMouseMove, false );





}



function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;


    var MainCtr = m_scs.get_object_by_name("MainCtr");

    m_tra.set_rotation_euler_rel(MainCtr, 0, mouseX/250, 0);
    //m_tra.set_scale(MainCtr, mouseY/20+10);




    //console.log(mouseY/20+10);
    //console.log(mouseY);
}






});

// import the app module and start the app by calling the init method
b4w.require("shave").init();
