"use strict"

// register the application module
b4w.register("shave", function(exports, require) {

// import modules used by the app
var m_app   =  require("app");
var m_data  =  require("data");

var m_scs   =  require("scenes");
var m_tra   =  require("transform");
var m_cam   =  require("camera");
var m_vec   =  require("vec3");
var m_ctl   =  require("controls");


var m_shot =  require("screenshooter");


var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var MotoMain;

var mainCam;
var cameye;

var xAxial;
var eyeAngle;
var LTCTRF;
var LTCTRB;

var time = 0;



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
    animate();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("b4w/obj/moto.json", load_cb);
}

/**
 * callback executed when the scene is loaded
 */
function load_cb(data_id) {
    m_app.enable_controls();
    m_app.enable_camera_controls();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    shot.addEventListener( 'click', shotting, false );

    LTCTRF = m_scs.get_object_by_name("LTCTRF");
    LTCTRB = m_scs.get_object_by_name("LTCTRB");
    MotoMain = m_scs.get_object_by_name("MotoMain");

}



function animate() {
    requestAnimationFrame( animate );

    render();

}

function shotting() {
    m_shot.shot();

}




function render() {    
    mainCam = m_scs.get_active_camera();
    cameye = m_cam.get_eye(mainCam);
    xAxial = [1,0,0];
    eyeAngle = m_vec.dot(cameye, xAxial) ;
    //console.log(eyeAngle);

    

    //console.log(time);

    if (eyeAngle>-4 && eyeAngle<4) {
        time+=1;
        m_tra.set_rotation_euler_rel(LTCTRF, time*1, 0, 0);
        m_tra.set_rotation_euler_rel(LTCTRB, time*1, 0, 0);
    }else{
        time=0;
    };


}




var MotoBias = 0.001;
var BiasX,BiasY ;
var BiasAngle;
var speedBase = 0.00002;
var motoSpeed = speedBase *1;

var myData = new Date(); 
var shot = document.getElementById('shot');






function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX );
    mouseY = ( event.clientY );

    BiasX = ( event.clientX - windowHalfX ) / 2;
    BiasY = ( event.clientY - windowHalfY ) / 2;

    BiasAngle = MotoBias * BiasX;

    motoSpeed = speedBase * mouseX * mouseY;



    if (eyeAngle>-4 && eyeAngle<4) {
        m_tra.set_rotation_euler_rel(MotoMain, 0, 0, BiasAngle);
    }else{
        m_tra.set_rotation_euler_rel(MotoMain, 0, 0, 0);

    m_tra.set_rotation_euler_rel(LTCTRF, motoSpeed, 0, 0);
    m_tra.set_rotation_euler_rel(LTCTRB, motoSpeed, 0, 0);

        //console.log("i am yes");
    };
    


    //m_tra.set_scale(LT_F), mouseY/20+10);




    
    //console.log(mouseY);
    //console.log(mouseY);
}






});

// import the app module and start the app by calling the init method
b4w.require("shave").init();
