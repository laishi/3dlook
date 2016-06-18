"use strict"

// register the application module
b4w.register("X50", function(exports, require) {

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

        load();
        
    }

    /**
     * load the scene data
     */
    function load() {
       m_data.load("assets/obj/X50-Out.json", load_cb, stageload_cb );

    }

    function load_cb(data_id) {

        m_app.enable_controls();
        m_app.enable_camera_controls(); 
        makeTyreCopy();
    }









    function stageload_cb(percentage, load_time) {

        var progressWave = document.getElementById("progressWave");        

        progressWaveCanvas.waveLoader('setProgress', percentage);

        if (percentage == 100) {
            progressWave.style.display = "none";
        }

    }




   




    //VIEWCUBE

    mainCam = m_scs.get_active_camera();

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

        annotations();

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







        //MAKE TYRE ANIMATION

        //var tyreRY = mouseX* (Math.PI/180) /25;

        //var CamRoot = m_scs.get_object_by_name("CamRoot");
        
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
b4w.require("X50").init();
