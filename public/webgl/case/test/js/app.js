
container = document.createElement('div');
document.body.appendChild(container);


// if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, cubeCamera, scene, renderer, parameters, i, j, k, h, color, x, y, z, s, n, nobjects,
    material_depth, cubeMaterial;




var mouse = new THREE.Vector2(), INTERSECTED;


var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;








var isMouseDown = false;
var mouseX = 0;
var mouseY = 0;
var target = new THREE.Vector3(0, 0, 50);
var height = window.innerHeight;



init();
animate();


function init() {



    //CAMERA
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set( 0, 0, 100 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));



    //SCENE
    scene = new THREE.Scene();



    /*RENDER*/

    raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });


    renderer.setClearColor(0x2FEE54, 0.0);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	container.appendChild(renderer.domElement);

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




    // GEOMETRY


// mesh = new THREE.Points( geometry, new THREE.PointsMaterial( { size: 3, color: c } ) );


    var bodyMat = new THREE.MeshPhongMaterial({
        color: 0x808080,
        side: THREE.DoubleSide,
        specular: 0x111111,
        shininess: 10,

    })

    //OBJ

    var OBJLoader = new THREE.JSONLoader();

    OBJLoader.load('obj/terrain.js', function(geometry, material) {
        iwatchBody = new THREE.Mesh(geometry, bodyMat);
        scene.add(iwatchBody);
    });







    window.addEventListener('resize', onWindowResized, false);
    onWindowResized(null);





} //INIT END








function onWindowResized(event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}






function animate() {

    requestAnimationFrame(animate);

    render();
}


function render() {

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);

}





