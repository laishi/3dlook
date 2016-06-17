"use strict"

b4w.register("x50Render", function(exports, require) {




    var m_app = require("app");
    var m_cfg = require("config");
    var m_data = require("data");
    var m_geom = require("geometry");
    var m_mat = require("material");
    var m_scs = require("scenes");
    var m_obj = require("objects");
    var m_trans = require("transform");

    var m_time = require("time");
    var m_camera_anim = require("camera_anim");


    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var x50drawing = document.getElementById("x50Render");




    exports.init = function(id) {
        m_app.init({
            canvas_container_id: id,
            callback: init_cb,
            physics_enabled: false,
            show_fps: false,
            alpha: true,
            gl_debug: true,
            autoresize: true,
            console_verbose: true
        });
    }

    function init_cb(canvas_elem, success) {

        if (!success) {
            console.log("b4w init failure");
            return;
        }

        m_app.enable_controls();
        load();

    }


    function load() {
        m_data.load("assets/obj/X50-Out.json", load_cb);
    }



    function load_cb(data_id) {
        m_app.enable_camera_controls();






    }










});


