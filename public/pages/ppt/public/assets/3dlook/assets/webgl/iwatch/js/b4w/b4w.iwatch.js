"use strict";

b4w.register("example_main", function(exports, require) {

    var m_anim   = require("animation");
    var m_app    = require("app");
    var m_data   = require("data");
    var m_main   = require("main");
    var m_scenes = require("scenes");
    var m_objs = require("objects");
    var m_tran = require("transform");
    var m_cfg = b4w.require("config");
    var m_anchors = require("anchors");

    var m_tex    = require("textures");
    var m_sfx    = require("sfx");




    var VIDEO_DELAY_TIME = 1000/30;

    var _previous_selected_obj = null;





    exports.init = function() {
        m_app.init({
            canvas_container_id: "b4wiwatch", 
            callback: init_cb,
            physics_enabled: false,
            alpha: true,
            /*autoresize: true,*/
        });
    }





    function init_cb(canvas_elem, success) {

        if (!success) {
            console.log("b4w init failure");
            return;
        }

        m_app.enable_controls(canvas_elem);
        canvas_elem.addEventListener("mousedown", main_canvas_click, false);

        load();
        window.onresize = on_resize;
        on_resize();
    }


    function on_resize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        m_main.resize(w, h);
    }



    function load() {    
        m_data.load("obj/iwatch/iwatchvsiri.json", load_cb);
    }



    function load_cb(data_id) {
        m_app.enable_camera_controls();

        var mouseX = 0, mouseY = 0;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

        function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) / 200;
        mouseY = ( event.clientY - windowHalfY ) / 200;

        var mainiwatch = m_scenes.get_object_by_name("main-iwatch");
        /*m_tran.set_rotation_euler(mainiwatch, mouseY, mouseX, 0);*/
        }

        load_data();
    }










    /*LOAD VIDE*/
    function load_data() {


        var ctx = m_tex.get_canvas_texture_context("siri");

        m_tex.update_canvas_texture_context("siri");




    }









    function main_canvas_click(e) {
        if (e.preventDefault)
            e.preventDefault();

        var x = e.clientX;
        var y = e.clientY;

        var obj = m_scenes.pick_object(x, y);

        if (obj) {
            if (_previous_selected_obj) {
                m_anim.stop(_previous_selected_obj);
                m_anim.set_frame(_previous_selected_obj, 0);
            }
            _previous_selected_obj = obj;

            m_anim.apply_def(obj);
            m_anim.play(obj);
        }
    }




    window.onload = function () {

        var galdred = document.querySelector('#galdred');
        var galdgreen = document.querySelector('#galdgreen');
        var galdblue = document.querySelector('#galdblue');

        function changered(event) {        
        var cube = m_scenes.get_object_by_name("Iwatch-handle");
        m_objs.set_nodemat_rgb(cube, ["Hander-Mat", "My_rgb_node"], 1, 0, 0);
        }

        function changegreen(event) {        
        var cube = m_scenes.get_object_by_name("Iwatch-handle");
        m_objs.set_nodemat_rgb(cube, ["Hander-Mat", "My_rgb_node"], 0, 1, 0);
        }

        function changeblue(event) {        
        var cube = m_scenes.get_object_by_name("Iwatch-handle");
        m_objs.set_nodemat_rgb(cube, ["Hander-Mat", "My_rgb_node"], 0, 0, 1);
        }

        galdred.addEventListener('mouseover', changered, false);
        galdgreen.addEventListener('mouseover', changegreen, false);
        galdblue.addEventListener('mouseover', changeblue, false);

    };




});


b4w.require("example_main").init();