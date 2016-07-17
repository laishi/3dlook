"use strict"

// register the application module
b4w.register("x50Render", function(exports, require) {

    // import modules used by the app
    var m_app = require("app");
    var m_data = require("data");
    var m_scs = require("scenes");
    var m_cam = require("camera");
    var m_obj = require("objects");
    var m_cont   = require("container");
    var m_geom  = require("geometry");

    var m_anim = require("animation");
    var m_trans = require("transform");
    var m_cons = require("constraints");
    var m_mat = require("material");

    var m_vec3 = require("vec3");
    var m_util = require("util");
    var m_time = require("time");
    var m_ctl = require("controls");
    var m_shooter = require("screenshooter");
    var m_camera_anim = require("camera_anim");

    var m_anchors = require("anchors");

    var progressWaveCanvas = $('#progressWaveCanvas');

    var ANIM_TIME = 0.25;
    var _anim_stop = false;
    var _delta_target = ANIM_TIME;
    var _cam_anim = {
        timeline: -ANIM_TIME,
        starting_eye: new Float32Array(3),
        starting_target: new Float32Array(3),
        final_eye: new Float32Array(3),
        final_target: new Float32Array(3),
        current_eye: new Float32Array(3),
        current_target: new Float32Array(3)
    }
    var _vec3_tmp = new Float32Array(3);


    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;


    var mainCam;
    var cameye;

    var runTimeNow = 0;
    var timeGain = 0;

    var X50RenderCanvas = document.getElementById("X50RenderCanvas");


    /**
     * export the method to initialize the app (called at the bottom of this file)
     */
    exports.init = function() {
        m_app.init({
            canvas_container_id: "X50RenderCanvas",
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

        canvas_elem.addEventListener("mousemove", X50RenderCanvasMouseMove, false);
        /*canvas_elem.addEventListener("mousedown", main_canvas_click, false);*/
        load();        
    }

    /**
     * load the scene data
     */
    function load() {        
        m_data.load("assets/obj/X50Render/X50-Out.json", load_cb, stageload_cb );
    }

    function drawingload_cb() {


        var BodyDrawing = m_scs.get_object_by_name("X50-BodyDrawing");


        m_scs.hide_object(BodyDrawing);

        var x50drawing = m_scs.get_all_objects();
         alert(BodyDrawing);
    }



    function load_cb(data_id) {

        m_data.load("assets/obj/X50RenderIn/X50-In.json", inload_cb);
        m_app.enable_controls();
        m_app.enable_camera_controls(); 
        makeTyreCopy();
        
        animate();
        annotations();

        var camobj = m_scs.get_active_camera();
        init_camera_animation(camobj);
        X50RenderCanvas.addEventListener("mousedown", main_canvas_mousedown);
    }


    var lineWS = 0;
    var lineHS = 0;
    var lineDS = 0;

    var lineWT = 29.062;
    var lineHT = 10.828;
    var lineDT = 12.294;

    var cubeSizeOP = 0;

    var lineTweenTime = 1.8;


    var lineOn = document.querySelector(".lineOn");
    var lineOff = document.querySelector(".lineOff");

    var tipRuler = document.querySelector(".tipRuler");

    var lfRuler = document.querySelector(".lf-ruler");


    var lfRulerW = document.getElementById("annotationsW");
    var lfRulerH = document.getElementById("annotationsH");
    var lfRulerD = document.getElementById("annotationsD");


    var lineOnOff = 0;
    tipRuler.onclick = function () {
        if (lineOnOff == 0) {
            cubeSizeOP = 0.5;
            lineWS = 0;
            lineHS = 0;
            lineDS = 0;
            lineWT = 29.062;
            lineHT = 10.828;
            lineDT = 12.294;
            draw_lines();

            lfRuler.className = "lf lf-close";
            lfRulerW.style.visibility = "visible";
            lfRulerH.style.visibility = "visible";
            lfRulerD.style.visibility = "visible";

            lineOnOff = 1;
        } else{

            cubeSizeOP = 0;

            lineWT = 0;
            lineHT = 0;
            lineDT = 0;

            lineWS = 29.062;
            lineHS = 10.828;
            lineDS = 12.294;

            draw_lines();

            lfRuler.className = "lf lf-ruler";
            lfRulerW.style.visibility = "hidden";
            lfRulerH.style.visibility = "hidden";
            lfRulerD.style.visibility = "hidden";

            lineOnOff = 0;

        }
    }






    function draw_lines() {

        var cubeB = m_scs.get_object_by_name("CubeB");
        m_obj.set_nodemat_value(cubeB, ["CubeB-Mat", "cubeSizeOP"], cubeSizeOP);

        var CubeLine01 = m_scs.get_object_by_name("CubeLine01");
        var CubeLine02 = m_scs.get_object_by_name("CubeLine02");
        var CubeLine03 = m_scs.get_object_by_name("CubeLine03");
        var CubeLine04 = m_scs.get_object_by_name("CubeLine04");
        

        var lineSizePosS = [lineWS,lineHS,lineDS];
        var lineSizePosT = [lineWT,lineHT,lineDT];        


        lineSizePosT.onUpdate = function() {

            var lineW = lineSizePosS[0]
            var lineH = lineSizePosS[1]
            var lineD = lineSizePosS[2]

            m_geom.draw_line(CubeLine01, new Float32Array([0.0,0.0,0.0, 0.0,-lineH,0.0, 0.0,0.0,0.0, -lineD,0,0.0, 0.0,0,0.0, 0.0,0.0,-lineW, ]), false);
            m_geom.draw_line(CubeLine02, new Float32Array([0.0,0.0,0.0, 0.0,lineH,0.0, 0.0,0.0,0.0, lineD,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,-lineW, ]), false);
            m_geom.draw_line(CubeLine03, new Float32Array([0.0,0.0,0.0, 0.0,lineH,0.0, 0.0,0.0,0.0, -lineD,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,lineW, ]), false);
            m_geom.draw_line(CubeLine04, new Float32Array([0.0,0.0,0.0, 0.0,-lineH,0.0, 0.0,0.0,0.0, lineD,0,0, 0.0,0.0,0.0, 0.0,0.0,lineW, ]), false); };
                    

        TweenMax.to(lineSizePosS, lineTweenTime, lineSizePosT); 


        var lineMatW = 5;
        var lineCol = new Float32Array([1.0, 1.0, 1.0, 0.9]);

        //m_geom.draw_line(CubeLine01, new Float32Array([0.0, 0.0, 0.0, 0.0, 0.0, -lineW,]), true);


        m_mat.set_line_params(CubeLine01, {
            color: lineCol,
            width: lineMatW
        });

        m_mat.set_line_params(CubeLine02, {
            color: lineCol,
            width: lineMatW
        });

        m_mat.set_line_params(CubeLine03, {
            color: lineCol,
            width: lineMatW
        });

        m_mat.set_line_params(CubeLine04, {
            color: lineCol,
            width: lineMatW
        });

    }







    function annotations() {

        var annotationsTip = [];
        annotationsTip.push(document.getElementById("annotationsLock"));
        annotationsTip.push(document.getElementById("annotationsBody"));
        annotationsTip.push(document.getElementById("annotationsRack"));
        annotationsTip.push(document.getElementById("annotationsTyre"));
        annotationsTip.push(document.getElementById("annotationsFace"));

        annotationsTip.push(document.getElementById("annotationsRuler"));

        annotationsTip.push(document.getElementById("annotationsW"));
        annotationsTip.push(document.getElementById("annotationsH"));
        annotationsTip.push(document.getElementById("annotationsD"));



        var annotationsObj = [];
        annotationsObj.push(m_scs.get_object_by_name("annotationsLock"));
        annotationsObj.push(m_scs.get_object_by_name("annotationsBody"));
        annotationsObj.push(m_scs.get_object_by_name("annotationsRack"));
        annotationsObj.push(m_scs.get_object_by_name("annotationsTyre"));
        annotationsObj.push(m_scs.get_object_by_name("annotationsFace"));

        annotationsObj.push(m_scs.get_object_by_name("CubeRuler"));

        annotationsObj.push(m_scs.get_object_by_name("CubeW"));
        annotationsObj.push(m_scs.get_object_by_name("CubeH"));
        annotationsObj.push(m_scs.get_object_by_name("CubeD"));



        m_anchors.attach_move_cb (annotationsObj[0], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[0];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";

            if (appearance == "visible")
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        });


        m_anchors.attach_move_cb (annotationsObj[1], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[1];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";

            if (appearance == "visible")
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        });

        m_anchors.attach_move_cb (annotationsObj[2], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[2];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";


            if (appearance == "visible")
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        });

        m_anchors.attach_move_cb (annotationsObj[3], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[3];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";

            if (appearance == "visible")
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        });

        m_anchors.attach_move_cb (annotationsObj[4], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[4];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";


            if (appearance == "visible")
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        });

        m_anchors.attach_move_cb (annotationsObj[5], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[5];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";


            if (appearance == "visible")
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        });


        //WHD SIZE
        m_anchors.attach_move_cb (annotationsObj[6], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[6];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";


        });
        m_anchors.attach_move_cb (annotationsObj[7], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[7];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";

        });

        m_anchors.attach_move_cb (annotationsObj[8], function (x, y, appearance, obj, elem) {
            var anchor_elem = annotationsTip[8];
            anchor_elem.style.left = x - anchor_elem.offsetWidth/2 + "px";
            anchor_elem.style.top = y - anchor_elem.offsetHeight/2 + "px";

        });

    }



    function inload_cb() {        

        var BodyFBGlass = m_scs.get_object_by_name("Body-FB-Glass");
        m_obj.set_nodemat_value(BodyFBGlass, ["Glass-FB-Mat", "GlassOP"], 0);

        var DoorFL = m_scs.get_object_by_name("Door-FL");
        m_obj.set_nodemat_value(DoorFL, ["Glass-Mat", "GlassOP"], 0);

        var DoorFR = m_scs.get_object_by_name("Door-FR");
        m_obj.set_nodemat_value(DoorFR, ["Glass-Mat", "GlassOP"], 0);

        var DoorBL = m_scs.get_object_by_name("Door-BL");
        m_obj.set_nodemat_value(DoorBL, ["Glass-Mat", "GlassOP"], 0);
    }







    function playCubeSize() {

        var cubeSize = m_scs.get_object_by_name("CubeSize");
        m_anim.apply(cubeSize, 'CubeSizeAction', m_anim.SLOT_0);
        m_anim.set_speed(cubeSize, 1, m_anim.SLOT_0);
        m_anim.set_first_frame(cubeSize, m_anim.SLOT_0);
        m_anim.play(cubeSize, finish_callback, m_anim.SLOT_0);       

    }


    function finish_callback() {

        var cubeSize = m_scs.get_object_by_name("CubeSize");
        m_anim.apply(cubeSize, 'CubeSizeAction', m_anim.SLOT_0);
        //m_anim.stop(cubeSize,m_anim.SLOT_0);
        alert(m_anim.get_speed(cubeSize, m_anim.SLOT_0));
    }





    function X50RenderCanvasMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }








    function stageload_cb(percentage, load_time) {
        var progressWave = document.getElementById("progressWave");
        progressWaveCanvas.waveLoader('setProgress', percentage);
        if (percentage == 100) {
            progressWave.style.display = "none";
        }

    }


    // SET BG
    function main_canvas_mousedown(e) {
        X50RenderCanvas.style.backgroundImage= ""; 

    }

    function makeTyreCopy() {

        var TyreFL = m_scs.get_object_by_name("TyreFL");

        var TyreFtoB = m_obj.copy(TyreFL, "TyreBL", false);
        var TyreFtoR = m_obj.copy(TyreFL, "TyreFR", false);

        var TyreRtoB = m_obj.copy(TyreFL, "TyreRB", false);

        m_trans.move_local(TyreFtoB, 0, 0, -18);
        m_trans.move_local(TyreFtoR, -10, 0, 0);
        m_trans.set_rotation_euler(TyreFtoR, 0, Math.PI, 0);

        m_trans.move_local(TyreRtoB, -10, 0, -18);
        m_trans.set_rotation_euler(TyreRtoB, 0, Math.PI, 0);

        m_scs.append_object(TyreFtoB);
        m_scs.append_object(TyreFtoR);
        m_scs.append_object(TyreRtoB);

    }




    //CHANGE COLOR
    var curColR = 0.90;
    var curColG = 0.01;
    var curColB = 0.01;

    var baseColR = 0.90;
    var baseColG = 0.01;
    var baseColB = 0.01;

    var curTime = 0;
    var changeOnOff = 0;
    var colShift = -1;

    var oneCol;
    var twoCol;
    var baseCol;

    var RGBR = 220;
    var RGBG = 10;
    var RGBB = 10;

    var BtnCol = document.querySelectorAll(".colBtn");

    for (var i = 0; i < BtnCol.length; i++) {
        BtnCol[i].addEventListener("click", cColor, false);
    }

    function cColor() {
        var colorGain = 300;
        var rgb = this.style.backgroundColor;
        rgb = rgb.replace(/[^\d,]/g, '').split(',');

        RGBR = rgb[0] / colorGain;
        RGBG = rgb[1] / colorGain;
        RGBB = rgb[2] / colorGain;

        curTime = m_time.get_timeline();

        if (changeOnOff == 1) {
            changeOnOff = -1;
        } else {

            changeOnOff = 1;
        }

        if (changeOnOff > 0) {
            curColR = RGBR;
            curColG = RGBG;
            curColB = RGBB;

        } else {
            baseColR = RGBR;
            baseColG = RGBG;
            baseColB = RGBB;
        }

    }


    var rampTime = 0;
    var runTime = 0;

    var runONOff = 0;

    var LightAngle_Get_H;
    var LightAngle_Get_V;

    var LightAngle_R;
    var LightAngle_R1;
    var LightAngle_R5;
    var LightAngle_R4;

    var LightAngle_L;
    var LightAngle_L1;
    var LightAngle_L5;
    var LightAngle_L6;


    // CAMARA ANIMATE

    function start_camera_animation(camobj, pos_view, pos_target) {
        // retrieve camera current position
        m_cam.target_get_pivot(camobj, _cam_anim.current_target);

        m_trans.get_translation(camobj, _cam_anim.current_eye);


        // set camera starting position
        m_vec3.copy(_cam_anim.current_target, _cam_anim.starting_target);
        m_vec3.copy(_cam_anim.current_eye, _cam_anim.starting_eye);

        // set camera final position
        m_vec3.copy(pos_view, _cam_anim.final_eye);
        m_vec3.copy(pos_target, _cam_anim.final_target);

        // start animation
        _delta_target = ANIM_TIME;
        _cam_anim.timeline = m_time.get_timeline();
    }

    function init_camera_animation(camobj) {

        var t_sensor = m_ctl.create_timeline_sensor();
        var e_sensor = m_ctl.create_elapsed_sensor();

        var logic_func = function(s) {
            // s[0] = m_time.get_timeline() (t_sensor value)
            return s[0] - _cam_anim.timeline < ANIM_TIME;
        }

        var cam_move_cb = function(camobj, id, pulse) {

            if (pulse == 1) {
                if (_anim_stop) {
                    _cam_anim.timeline = -ANIM_TIME;
                    return;
                }

                m_app.disable_camera_controls();

                // elapsed = frame time (e_sensor value)
                var elapsed = m_ctl.get_sensor_value(camobj, id, 1);
                var delta = elapsed / ANIM_TIME;

                m_vec3.subtract(_cam_anim.final_eye, _cam_anim.starting_eye, _vec3_tmp);
                m_vec3.scaleAndAdd(_cam_anim.current_eye, _vec3_tmp, delta, _cam_anim.current_eye);

                _delta_target -= elapsed;
                delta = 1 - _delta_target * _delta_target / (ANIM_TIME * ANIM_TIME);
                m_vec3.subtract(_cam_anim.final_target, _cam_anim.starting_target, _vec3_tmp);
                m_vec3.scaleAndAdd(_cam_anim.starting_target, _vec3_tmp, delta, _cam_anim.current_target);

                m_cam.target_set_trans_pivot(camobj, _cam_anim.current_eye, _cam_anim.current_target);

            } else {
                m_app.enable_camera_controls(false);
                if (!_anim_stop)
                    m_cam.target_set_trans_pivot(camobj, _cam_anim.final_eye, 
                            _cam_anim.final_target);
                else
                    _anim_stop = false;
            }
        }

        m_ctl.create_sensor_manifold(camobj, "CAMERA_MOVE", m_ctl.CT_CONTINUOUS,
                [t_sensor, e_sensor], logic_func, cam_move_cb);
    }



    //VIEWCUBE

    //mainCam = m_scs.get_active_camera();

    var viewCube = document.querySelector(".viewCube");

    var cubeRot;
    var cubeRotH;
    var cubeRotV;

    var cubeHome = document.getElementById("cubeHome");
    var cubeShooter = document.getElementById("cubeShooter");
    var cubeFullScreen = document.getElementById("cubeFullScreen");


    var cubeHome = document.getElementById("cubeHome");

    var viewCubeF = document.getElementById("front");
    var viewCubeB = document.getElementById("back");
    var viewCubeR = document.getElementById("right");
    var viewCubeL = document.getElementById("left");
    var viewCubeU = document.getElementById("up");
    var viewCubeD = document.getElementById("down");
    var viewCubeD = document.getElementById("shadow");



    var camLookAt = new Float32Array([0, 0, 0]);
    var camPosH = new Float32Array([32.60566, 5.76115,42.67982]);

    var camPosF = new Float32Array([0,  6.5, 50]);
    var camPosB = new Float32Array([0,  8.0, -50]);
    var camPosR = new Float32Array([60,  6.5, 0]);
    var camPosL = new Float32Array([-60,  6.5, 0]);
    var camPosU = new Float32Array([0,  80, 0]);
    var camPosD = new Float32Array([0,  -80, 0]);


    cubeFullScreen.onclick = function () {
        m_app.request_fullscreen(X50RenderCanvas)
    }


    cubeShooter.onclick = function () {
        // m_camera_anim.auto_rotate(0.5);
        m_shooter.shot();

    }


    cubeHome.onclick = function () {

        start_camera_animation(mainCam, camPosH, camLookAt);
        X50RenderCanvas.style.backgroundImage= "url(img/BG-City.jpg)";
        
    }

    viewCubeF.onclick = function () {

        start_camera_animation(mainCam, camPosF, camLookAt);
        X50RenderCanvas.style.backgroundImage= "url(img/BG-Road.jpg)";

        
    }

    viewCubeB.onclick = function () {

        start_camera_animation(mainCam, camPosB, camLookAt);

    }

    viewCubeR.onclick = function () {
        start_camera_animation(mainCam, camPosR, camLookAt);
        X50RenderCanvas.style.backgroundImage= "url(img/BG-Side.jpg)";
    }

    viewCubeL.onclick = function () {

        start_camera_animation(mainCam, camPosL, camLookAt);
        X50RenderCanvas.style.backgroundImage= "url(img/BG-Side.jpg)";
    }

    viewCubeU.onclick = function () {

        start_camera_animation(mainCam, camPosU, camLookAt);
    }

/*    viewCubeD.onclick = function () {

        start_camera_animation(mainCam, camPosD, camLookAt);
    }*/


    // RUN CAR

    var runBtn = document.getElementById("runBtn");
    var stopBtn = document.getElementById("stopBtn");
    var audio = new Audio('Sound/whhhd.mp3');

    runBtn.onclick = function () {
        
        audio.play();
        m_camera_anim.auto_rotate(0.2);
        runTimeNow = m_time.get_timeline();

        runONOff = 1;
        timeGain = 5;
        
        var GroundGrid = m_scs.get_object_by_name("GroundGrid");
        m_obj.set_nodemat_value(GroundGrid, ["GroundGrid-Mat", "GridRun"], runONOff);
        m_obj.set_nodemat_value(GroundGrid, ["GroundGrid-Mat", "ShowGrid"], 1);

        playCubeSize();

    }


    stopBtn.onclick = function () {
        audio.pause();
        m_camera_anim.auto_rotate(0.0);
        runTimeNow = m_time.get_timeline();
        runONOff = 0;
        timeGain = 5;
        var GroundGrid = m_scs.get_object_by_name("GroundGrid");
        m_obj.set_nodemat_value(GroundGrid, ["GroundGrid-Mat", "GridRun"], runONOff);
        m_obj.set_nodemat_value(GroundGrid, ["GroundGrid-Mat", "ShowGrid"], 1);
    }


    //MAP

    var mapOn = 0;
    var mapMH = 0;
    var mapMW = 0;

    var mapHot = document.getElementById("mapHot");
    var mapMusic = document.getElementById("mapMusic");
    var mapWave = document.getElementById("mapWave");
    var mapSea = document.getElementById("mapSea");

    mapHot.onclick = function () {
        mapOn = 1;
        mapMH = 1;
        mapMW = 1;

    }
    mapMusic.onclick = function () {
        mapOn = 1;
        mapMH = 0;
        mapMW = 1;

    }

    mapWave.onclick = function () {
        mapOn = 1;
        mapMH = 0;
        mapMW = 0;

    }

    //LIGHTING

    var lightPower = 0;
    var lightOn = document.getElementById("lightOn");
    var lightOff = document.getElementById("lightOff");

    lightOn.onclick = function () {
        lightPower = 1;
    }
    lightOff.onclick = function () {
        lightPower = 0;
    }


    function animate() {
        requestAnimationFrame(animate);
        render();
    }


    function render() {


        mainCam = m_scs.get_active_camera();
        cameye = m_cam.get_translation(mainCam);


        var sinTime = ((m_time.get_timeline() - curTime) + colShift) * changeOnOff;

        rampTime = sinTime;

        var runTime = ((m_time.get_timeline() - runTimeNow)) * runONOff;


        var camRot = m_trans.get_rotation(mainCam);
        var viewCubeFP = m_scs.get_object_by_name("viewCube-FP");
        var viewCubeFP_POS = m_trans.get_translation(viewCubeFP);

        var getCamRotation = m_trans.get_rotation(mainCam);
        cubeRotH = m_cam.get_camera_angles(mainCam)[0] * -1;
        cubeRotV = m_cam.get_camera_angles(mainCam)[1] * 1;


        var viewCuberotateX = "rotateX" + "(" + cubeRotV + "rad" + ")";
        var viewCuberotateY = "rotateY" + "(" + cubeRotH + "rad" + ")";

        var viewCuberotate = viewCuberotateX + " " + viewCuberotateY;
        viewCube.style.transform = viewCuberotate;

        LightAngle_Get_H = m_cam.get_camera_angles(mainCam)[0];
        LightAngle_Get_V = m_cam.get_camera_angles(mainCam)[1];        

        var topAngleOp =  LightAngle_Get_V + 1.5;


        if (LightAngle_Get_H > 4.0) {
            LightAngle_R4 = Math.abs(4.0 - LightAngle_Get_H) * 0.45;
            LightAngle_R = LightAngle_R4 * 1 * lightPower;

        } else if (LightAngle_Get_H < 1) {

            LightAngle_R1 = Math.pow((1 - LightAngle_Get_H), 3);
            LightAngle_R = LightAngle_R1 * 1 * lightPower;

        };

        if (LightAngle_Get_V < 0.8) {
            LightAngle_R5 = 1 + LightAngle_Get_V;
            LightAngle_R = LightAngle_R * LightAngle_R5 * lightPower;

        }


        //LEFT LAMP CTR

        if (LightAngle_Get_H > 6) {
            LightAngle_L6 = Math.abs(6 - LightAngle_Get_H) * 5;
            LightAngle_L = LightAngle_L6 * 1 * lightPower;

        } else {

            LightAngle_L1 = Math.sqrt(1.5 - LightAngle_Get_H);
            LightAngle_L = LightAngle_L1 * 1 * lightPower;

        };

        if (LightAngle_Get_V < 0.8) {
            LightAngle_L5 = 1 + LightAngle_Get_V;
            LightAngle_L = LightAngle_L * LightAngle_L5 * lightPower;

        }


        var camEyeNormalize = new Float32Array(3);
        m_vec3.normalize(cameye, camEyeNormalize);

        var lightPos = [1, 0, 0];
        var lightPosNormalize = new Float32Array(3);
        m_vec3.normalize(lightPos, lightPosNormalize);

        var xAxial = [0, 1, 0];
        var eyeAngle = 1 - m_vec3.dot(camEyeNormalize, xAxial);



        set_node_material_params();

        function set_node_material_params() {

            //LAMP FLARE

            var FlareFR = m_scs.get_object_by_name("Flare-FR");
            m_obj.set_nodemat_value(FlareFR, ["Flare-Long-Mat", "FlareOp"], LightAngle_R);

            var FlareRLF = m_scs.get_object_by_name("Flare-RLF");
            m_obj.set_nodemat_value(FlareRLF, ["Flare-Front-Mat", "FlareOp"], LightAngle_R);

            var FlareFL = m_scs.get_object_by_name("Flare-FL");
            m_obj.set_nodemat_value(FlareFL, ["Flare-Long-Mat", "FlareOp"], LightAngle_L);

            var FlareFLF = m_scs.get_object_by_name("Flare-FLF");
            m_obj.set_nodemat_value(FlareFLF, ["Flare-Front-Mat", "FlareOp"], LightAngle_L);

            var BodyTop = m_scs.get_object_by_name("Body-Top");
            m_obj.set_nodemat_value(BodyTop, ["Body-Top-Mat", "TopOpa"], topAngleOp);
            m_obj.set_nodemat_value(BodyTop, ["Body-Top-Mat", "ColorTop"], rampTime);
            m_obj.set_nodemat_rgb(BodyTop, ["Body-Top-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(BodyTop, ["Body-Top-Mat", "ColTwo"], curColR, curColG, curColB);

            var BodyWindowTop = m_scs.get_object_by_name("Body-Window-Top");
            m_obj.set_nodemat_value(BodyWindowTop, ["Body-Top-Window-Mat", "WindowOpa"], topAngleOp -0.2);


            var BodyMain = m_scs.get_object_by_name("Body-Main");
            m_obj.set_nodemat_value(BodyMain, ["Body-Main-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(BodyMain, ["Body-Main-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(BodyMain, ["Body-Main-Mat", "ColTwo"], curColR, curColG, curColB);


            var BodyMainSide = m_scs.get_object_by_name("Body-Main-Side");
            m_obj.set_nodemat_value(BodyMainSide, ["Body-Main-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(BodyMainSide, ["Body-Main-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(BodyMainSide, ["Body-Main-Mat", "ColTwo"], curColR, curColG, curColB);

            m_obj.set_nodemat_value(BodyMainSide, ["Body-Main-Mat", "mapOn"], mapOn);
            m_obj.set_nodemat_value(BodyMainSide, ["Body-Main-Mat", "mapMH"], mapMH);
            m_obj.set_nodemat_value(BodyMainSide, ["Body-Main-Mat", "mapMW"], mapMW);


            var BodyMain = m_scs.get_object_by_name("DoorFGJ-FL");
            m_obj.set_nodemat_value(BodyMain, ["Doot-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(BodyMain, ["Doot-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(BodyMain, ["Doot-Mat", "ColTwo"], curColR, curColG, curColB);

            var BodyMain = m_scs.get_object_by_name("DoorFGJ-FR");
            m_obj.set_nodemat_value(BodyMain, ["Doot-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(BodyMain, ["Doot-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(BodyMain, ["Doot-Mat", "ColTwo"], curColR, curColG, curColB);


            var DoorFL = m_scs.get_object_by_name("Door-FL");
            m_obj.set_nodemat_value(DoorFL, ["Doot-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(DoorFL, ["Doot-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(DoorFL, ["Doot-Mat", "ColTwo"], curColR, curColG, curColB);

            m_obj.set_nodemat_value(DoorFL, ["Doot-Mat", "mapOn"], mapOn);
            m_obj.set_nodemat_value(DoorFL, ["Doot-Mat", "mapMH"], mapMH);
            m_obj.set_nodemat_value(DoorFL, ["Doot-Mat", "mapMW"], mapMW);


            var DoorFR = m_scs.get_object_by_name("Door-FR");
            m_obj.set_nodemat_value(DoorFR, ["Doot-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(DoorFR, ["Doot-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(DoorFR, ["Doot-Mat", "ColTwo"], curColR, curColG, curColB);

            m_obj.set_nodemat_value(DoorFR, ["Doot-Mat", "mapOn"], mapOn);
            m_obj.set_nodemat_value(DoorFR, ["Doot-Mat", "mapMH"], mapMH);
            m_obj.set_nodemat_value(DoorFR, ["Doot-Mat", "mapMW"], mapMW);


            var DoorBL = m_scs.get_object_by_name("Door-BL");
            m_obj.set_nodemat_value(DoorBL, ["Doot-Mat", "ColorRB"], rampTime);
            m_obj.set_nodemat_rgb(DoorBL, ["Doot-Mat", "ColOne"], baseColR, baseColG, baseColB);
            m_obj.set_nodemat_rgb(DoorBL, ["Doot-Mat", "ColTwo"], curColR, curColG, curColB);

            m_obj.set_nodemat_value(DoorBL, ["Doot-Mat", "mapOn"], mapOn);
            m_obj.set_nodemat_value(DoorBL, ["Doot-Mat", "mapMH"], mapMH);
            m_obj.set_nodemat_value(DoorBL, ["Doot-Mat", "mapMW"], mapMW);


        }

        /*
        radians = degrees * (pi/180)
        degrees = radians * (180/pi)
        */


        
        var GroundGrid = m_scs.get_object_by_name("GroundGrid");

        var TyreFLP = m_scs.get_object_by_name("TyreFLP");
        

        var TyreFL = m_scs.get_object_by_name("TyreFL");
        m_trans.set_rotation_euler(TyreFL, runTime * timeGain, 0, 0);

        
        var TyreBL = m_scs.get_object_by_name("TyreBL");
        m_trans.set_rotation_euler(TyreBL, runTime * timeGain, 0, 0);


        var TyreFR = m_scs.get_object_by_name("TyreFR");
        m_trans.set_rotation_euler(TyreFR, runTime * -timeGain, 0, Math.PI);


        var TyreRB = m_scs.get_object_by_name("TyreRB");
        m_trans.set_rotation_euler(TyreRB, runTime * -timeGain, 0, Math.PI);

        //m_trans.set_rotation_euler(CamRoot, 0, tyreRY, 0);
        //m_trans.set_rotation_euler(FXPRY, 0, tyreRY, 0);

        //m_trans.set_rotation_euler(TyreFLP, 0, tyreRY, 0);
        //m_trans.set_rotation_euler(GroundGrid, 0, -tyreRY, 0);

    }

});

// import the app module and start the app by calling the init method
b4w.require("x50Render").init();
