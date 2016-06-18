
container = document.createElement('div');
document.body.appendChild(container);


// if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, cubeCamera, scene, renderer, parameters, i, j, k, h, color, x, y, z, s, n, nobjects,
    material_depth, cubeMaterial;

var spheres = [], bodies = [];


var mouse = new THREE.Vector2(), INTERSECTED;


var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;


var world;
var time, lastTime = performance.now();

var ballGeometry, ballMaterial, ballBodyMaterial;

var intersectionPlane, origin = new THREE.Vector3(0, 0, 0);
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
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(0, 0, 0));



    //SCENE
    scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xE6003F, 10, 30);



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

    var geometry = new THREE.PlaneGeometry(20, 20, 8, 8);
    intersectionPlane = new THREE.Mesh(geometry);
    intersectionPlane.position.y = 0;
    intersectionPlane.visible = false;
    scene.add(intersectionPlane);


    //


    ballGeometry = new THREE.SphereGeometry(0.8, 18, 18);

    var path = "../../img/eyes/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    var eyesMapPath = '../../img/eyes/eye.jpg';


    textureCube = new THREE.CubeTextureLoader().load( urls );

    var eyesMap = new THREE.TextureLoader().load( eyesMapPath );


    ballMaterial = new THREE.MeshPhongMaterial({
        map: eyesMap,
        envMap: textureCube,
        combine: THREE.MixOperation,
        reflectivity: 0.12,
        specular: 0x050505,
        shininess: 100,
        shading: THREE.SmoothShading
    });




	// PHYSICS



    world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.gravity.set(0, 0, 0);
    world.solver.iterations = 10;
    world.solver.tolerance = 1;

    ballBodyMaterial = new CANNON.Material();
    world.addContactMaterial(new CANNON.ContactMaterial(ballBodyMaterial, ballBodyMaterial, 0.2, 0.8));




    for (var i = 0; i < 20; i++) {

        addBall( Math.random(i) * 100 - 5, Math.random(i) * 10 - 5, Math.random(i) * 10 - 5, 10 )

    }



    // MOUSE


    document.body.style.cursor = 'pointer';

    document.addEventListener('mousedown', function(event) {

        event.preventDefault();
        isMouseDown = true;

    }, false);

    document.addEventListener('mousemove', function(event) {

        move(event)

    }, false);

    document.addEventListener('touchmove', function(event) {

        move(event)

    }, false);

    document.addEventListener('mouseup', function(event) {

        isMouseDown = false;

    }, false);

    // firefox

    document.addEventListener('visibilitychange', function(event) {

        if (document.hidden === false) {

            lastTime = performance.now();

        }

    }, false);

    // webkit

    document.addEventListener('webkitvisibilitychange', function(event) {

        if (document.webkitHidden === false) {

            lastTime = performance.now();

        }

    }, false);



    window.addEventListener('resize', onWindowResized, false);
    onWindowResized(null);





} //INIT END






function addBall(x, y, z) {

    x = Math.max(-10, Math.min(100, x));
    y = Math.max(-10, Math.min(10, y));
    z = Math.max(-10, Math.min(10, z));

    var size = 1.25;

    var sphere = new THREE.Mesh(ballGeometry, ballMaterial);
    sphere.scale.multiplyScalar(size);
    scene.add(sphere);

    spheres.push(sphere);

    var sphereShape = new CANNON.Sphere(size);
    var sphereBody = new CANNON.RigidBody(0.1, sphereShape, ballBodyMaterial);
    sphereBody.position.set(x, y, z);
    sphereBody.quaternion.set(Math.random() * 3, Math.random() * 3, Math.random() * 3, Math.random() * 3);

    sphereBody.preStep = function() {
        var moon_to_planet = new CANNON.Vec3((mouseX - window.innerWidth / 2) / 10, (-mouseY + window.innerHeight / 2) / 10, 10);
        this.position.negate(moon_to_planet);

        var distance = moon_to_planet.norm();

        moon_to_planet.normalize();
        moon_to_planet.mult(1, this.force);
    }

    world.add(sphereBody);
    bodies.push(sphereBody);

}

function removeBall() {

    scene.remove(spheres.shift());
    world.remove(bodies.shift());

}




function onWindowResized(event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}




function move(event) {


    target = new THREE.Vector3((mouseX - window.innerWidth / 2) / 1, (-mouseY + window.innerHeight / 2) / 1, 10);


	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	


	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );


	if ( intersects.length > 0 ) {

		origin.copy(intersects[0].point);

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;

			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			
			INTERSECTED.material.emissive.setHex( 0xff0000 );

		}

	} else {

		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

	}

}


function animate() {

    requestAnimationFrame(animate);

    if (isMouseDown) {
        if (spheres.length > 100) {
            removeBall();
        }

        addBall(
            origin.x + (Math.random() * 4 - 2),
            origin.y + (Math.random() * 4 - 2),
            origin.z + (Math.random() * 4 - 2)
        );

    }

    render();
}


function render() {


    time = performance.now();

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    intersectionPlane.lookAt(camera.position);

    world.step((time - lastTime) * 0.001);
    lastTime = time;

    for (var i = 0, l = spheres.length; i < l; i++) {

        var sphere = spheres[i];
        var body = bodies[i];

        sphere.position.copy(body.position);
        var tempRot = sphere.quaternion.clone();
        sphere.lookAt(target)
        var targetRot = sphere.quaternion.clone();
        sphere.quaternion.copy(tempRot);

        var spd = 100 * (10 + i) / l;

        sphere.quaternion.x -= (sphere.quaternion.x - targetRot.x) / spd;
        sphere.quaternion.y -= (sphere.quaternion.y - targetRot.y) / spd;
        sphere.quaternion.z -= (sphere.quaternion.z - targetRot.z) / spd;
        sphere.quaternion.w -= (sphere.quaternion.w - targetRot.w) / spd;

    }

    renderer.clear();
    renderer.render(scene, camera);

}





