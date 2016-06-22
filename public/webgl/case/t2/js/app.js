container = document.createElement('div');
document.body.appendChild(container);


// if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer, controls;

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var raycaster, mouse, intersected;


var mouseX, mouseY;

var cubeGrp;

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



    // controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 1000;



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






    // GEOMETRY

    var OBJLoader = new THREE.JSONLoader();

    OBJLoader.load('obj/t2.json', function(geometry, materials) {
        var t2obj = new THREE.Mesh(geometry, t2Mat);
        scene.add(t2obj);
    });



    var cubeposX = -2.9;
    var cubeposY = 5.3;
    var cubeposZ = 0.2;

    cubeGrp = new THREE.Group();
    // cubeGrp.position.set( cubeposX, cubeposY, cubeposZ );






    for (var Y = 0; Y < 4; Y++)
    for (var X = 0; X < 3; X++) {

        rowX= X+1;
        colY= Y+1;


        creatCube(cubeGrp, "cube"+colY +rowX,cubeposX + X * 2.9, cubeposY + Y * -3.7, 0.5);
        
    }


    cubeGrp.scale.set( 1, 1, 1 );

    console.log(scene.children.length)








    //EVENT
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResized, false);
    onWindowResized(null);




} //INIT END




function creatCube (cubeGrp,name, px, py, pz ) {



    var cubeObj = new THREE.BoxGeometry(  2.9, 3.7, 1 );
    var cubeMat = new THREE.MeshPhongMaterial( { color: Math.random() * 0x181818 } );
    var cubeMesh = new THREE.Mesh( cubeObj, cubeMat );

    // cubeMesh.scale.set( 2.9, 3.7, 2.9 );

    cubeMesh.position.set( px, py, pz );

    cubeMesh.name = name;

    cubeGrp.add( cubeMesh );

    scene.add( cubeGrp );
}




function onDocumentMouseMove(event) {


    event.preventDefault();



    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;





            // console.log(cubeGrp.children.position)





}



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




    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( cubeGrp.children );


    if ( intersects.length > 0 ) {




        if ( intersected != intersects[ 0 ].object ) {

            if (intersected) {
                intersected.material.emissive.setHex( intersected.currentHex );
                intersected.scale.set(1, 1, 1);
            }








            intersected = intersects[ 0 ].object;


            var intersectedName = intersected.name;



            intersected.scale.set(1, 1, 3);



            // console.log(intersectedName.position)

            // for (var i = 0; i < cubeGrp.children.length; i++) {


            //     var c = intersected.position;

            //     // var dis = Math.pow( c.distanceTo ( cubeM[i].position )/1, 2);


            //     var dis = cubeGrp.children[i].position .distanceTo ( c , 1)

            //     // console.log(c)

            //     cubeGrp.children[i].scale.set(1, 1, dis);

            // }




            intersected.currentHex = intersected.material.emissive.getHex();
            
            intersected.material.emissive.setHex( 0xff0000 );

        }

    } else {

        if ( intersected ) intersected.material.emissive.setHex( intersected.currentHex );

        intersected = null;

    }








    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);

}
