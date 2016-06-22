container = document.createElement('div');
document.body.appendChild(container);


// if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer, controls;

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var mouseX, mouseY;

var cubeGrp;

var clock = new THREE.Clock();

init();
animate();


function init() {



    //CAMERA

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));



    //SCENE
    scene = new THREE.Scene();
    scene.background = textureCube;


    /*RENDER*/


    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();


    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });


    renderer.setClearColor(0x2FEE54, 0.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    container.appendChild(renderer.domElement);




    // CONTROLS

    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.1;

    controls.keys = [ 65, 83, 68 ];



    // LIGHTS
    var ambient = new THREE.AmbientLight(0x020202);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xD13986, 0.5);
    directionalLight.position.set(300, 200, 300).normalize();
    scene.add(directionalLight);

    var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(-300, 200, 300).normalize();
    directionalLight.intensity = 0.6;
    scene.add(directionalLight);

    var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xE4E2D4, 0.8);
    hemiLight.position.set(0, -100, 0);
    hemiLight.intensity = 0.5;
    scene.add(hemiLight);





    /*ENV CUBE*/

    var textureCube = new THREE.CubeTextureLoader()
        .setPath( '../../img/env/studio-bw/')
        .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );



    //TEXTURE
    var t2d = new THREE.TextureLoader()
        .setPath( './tex/')
        .load( [ 't2-d.jpg' ] );


    var t2Mat = new THREE.MeshLambertMaterial( {
        // color: 0xff6600,
        map:t2d,
        specularMap:t2d,
        envMap: textureCube,
        combine: THREE.MixOperation,
        reflectivity: 0.3
    } );





    var manager = new THREE.LoadingManager();


    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    manager.onLoad = function ( ) {

        var T2V = scene.children[4].geometry.vertices;
        var LogoV = scene.children[5].geometry.vertices;

        LogoV = T2V;




        // var array = [{a:1},{a:2},{a:3},{a:1},{a:2}],
        //     amount = array.length;
            
        // for(var i = 0; i < amount; i++)
        // {
        //     var element = array[i];
        //     TweenMax.to(element, 1, {a:0});
        // }








        scene.children[4].geometry.verticesNeedUpdate = true;

        console.log(typeof  LogoV );
        // console.log( T2V );

    };



    // GEOMETRY


    var pointLogo;
    var t2obj;

    var OBJLoader = new THREE.JSONLoader( manager );


    

    OBJLoader.load('obj/logo.json', function(geometry, materials) {

        creatPoint(geometry, "pointLogo", true)

    });


    OBJLoader.load('obj/t2.json', function(geometry, materials) {

        t2obj = new THREE.Mesh(geometry, t2Mat);        

        creatPoint(geometry, "pointT2", true)

    });



    function creatPoint(geometry, name, visible) {

        var material = new THREE.PointsMaterial( { size: 0.1, color: Math.random() * 0x181818 } );

        var pointOBJ = new THREE.Points( geometry, material );

        pointOBJ.name = name;
        pointOBJ.visible = visible;

        scene.add(pointOBJ);
    }












    //EVENT
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResized, false);
    onWindowResized(null);




} //INIT END





function onDocumentMouseMove(event) {


    event.preventDefault();



}



function onWindowResized(event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();

}






function animate() {

    requestAnimationFrame(animate);

    render();
}


function render() {





    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);
    controls.update( clock.getDelta() );

}
