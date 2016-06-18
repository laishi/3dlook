    var camera, controls, scene, renderer;
    var geometry, material, mesh;
    var iwatchgroup;

    var x_min = 0;
    var y_min = 0;

    var x_max = window.innerWidth;
    var y_max = window.innerHeight;

    var x_mid = window.innerWidth / 2;
    var y_mid = window.innerHeight / 2;


    var raycaster = new THREE.Raycaster(),
        INTERSECTED;
    var mouse = new THREE.Vector2();


    var envTex;

    var iwatchBody, iwatchBtn, iwatchScreen, iwatchHand;

    var mynote;

    var map, screenVideo;
    var message, calendar, bodyimg, phone, email, wechat;



    var mouseX = 0,
        mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;




    sm = document.querySelectorAll(".annotation");
    smf = document.querySelector(".annotation1");




    init();
    animate();

    function init() {


        iwatchgroup = new THREE.Object3D(); //END MUST ADD TO SCENCE

        // CAMERA

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200000);
        camera.position.z = 120;
        camera.position.x = 0;






        iwatchgroup.add(camera);


        // RENDER
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0.0);
        contentWrap.appendChild(renderer.domElement);




        //SCENE
        scene = new THREE.Scene();


        // LIGHT


        var ambient = new THREE.AmbientLight(0x020202);
        scene.add(ambient);

        directionalLight = new THREE.DirectionalLight(0xFFFFFF);
        directionalLight.position.set(300, 200, 300).normalize();
        directionalLight.intensity = 0.3;
        scene.add(directionalLight);

        hemiLight = new THREE.HemisphereLight(0xDBE1E4, 0xE4E2D4, 0.8);
        hemiLight.position.set(0, 100, 0);
        hemiLight.intensity = 1.0;
        scene.add(hemiLight);




        //NOTE P



        var material = new THREE.LineBasicMaterial({
            color: 0x2386C0
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(25, 10, 30.5),
            new THREE.Vector3(0, 42, 0),
            new THREE.Vector3(0, 24, 30)
        );

        mynote = new THREE.Line(geometry, material);
        //scene.add( mynote );




        /*ENV CUBE*/
        var path = "../../img/env/studio-bw/";
        var format = '.jpg';
        var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format,
        ];

        envTex = THREE.ImageUtils.loadTextureCube(urls);


        // VIDEO
        video = document.createElement('video');
        video.src = "video/jk.ogv";
        video.loop = true;
        video.load(); // must call after setting/changing source
        video.play();


        videoImage = document.createElement('canvas');
        videoImage.width = 799;
        videoImage.height = 1000;


        videoImageContext = videoImage.getContext('2d');
        // background color if no video present
        videoImageContext.fillStyle = '#000000';

        videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

        screenVideo = new THREE.Texture(videoImage);
        screenVideo.minFilter = THREE.LinearFilter;
        screenVideo.magFilter = THREE.LinearFilter;


        //TEXTURE

        message = THREE.ImageUtils.loadTexture("img/screen/01.jpg");
        message.minFilter = THREE.LinearFilter;
        calendar = THREE.ImageUtils.loadTexture("img/screen/02.jpg");
        calendar.minFilter = THREE.LinearFilter;
        bodyimg = THREE.ImageUtils.loadTexture("img/screen/03.jpg");
        bodyimg.minFilter = THREE.LinearFilter;
        phone = THREE.ImageUtils.loadTexture("img/screen/04.jpg");
        phone.minFilter = THREE.LinearFilter;
        email = THREE.ImageUtils.loadTexture("img/screen/05.jpg");
        email.minFilter = THREE.LinearFilter;
        wechat = THREE.ImageUtils.loadTexture("img/screen/06.jpg");
        wechat.minFilter = THREE.LinearFilter;



        map = screenVideo;




        //MATERIAL
        var screenMat = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            map: map,
            side: THREE.DoubleSide,
            specular: 0x111111,
            shininess: 10,
            envMap: envTex,
            combine: THREE.AddOperation,
            refractionRatio: 0.98,
            reflectivity: 0.1,

        })




        var bodyMat = new THREE.MeshPhongMaterial({
            color: 0x808080,
            side: THREE.DoubleSide,
            specular: 0x111111,
            shininess: 10,
            envMap: envTex,
            combine: THREE.AddOperation,
            refractionRatio: 0.98,
            reflectivity: 0.4,

        })






        var handMat = new THREE.MeshPhongMaterial({
            color: 0x2380E4,
            side: THREE.DoubleSide,
            specular: 0x111111,
            emissive: new THREE.Color('rgb(10, 10, 10)'),
            shininess: 5,
            metal: false,
        })

        var funMat = new THREE.MeshPhongMaterial({
            color: 0x2B2B2B,
            side: THREE.DoubleSide,
            specular: 0x111111,
        })






        //OBJ

        var OBJLoader = new THREE.BinaryLoader();

        OBJPath = 'obj/';

        OBJLoader.load(OBJPath + 'AppleWatch_000.js', function(geometry, materials) {
            iwatchBody = new THREE.Mesh(geometry, bodyMat);
            scene.add(iwatchBody);
        });
        OBJLoader.load(OBJPath + 'AppleWatch_001.js', function(geometry, materials) {
            iwatchBtn = new THREE.Mesh(geometry, funMat);
            scene.add(iwatchBtn);
        });
        OBJLoader.load(OBJPath + 'AppleWatch_002.js', function(geometry, materials) {
            iwatchScreen = new THREE.Mesh(geometry, screenMat);
            iwatchScreen.name = "woshipm";
            scene.add(iwatchScreen);
        });
        OBJLoader.load(OBJPath + 'AppleWatch_003.js', function(geometry, materials) {
            iwatchHand = new THREE.Mesh(geometry, handMat);
            scene.add(iwatchHand);
        });




        scene.add(iwatchgroup);

        iwatchgroup.position.x = 300;
        //EVENT

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);


        document.addEventListener('keydown', onKeyDown, false);



        var onKeyDown = function(event) {
            if (event.keyCode == 67) { // when 'c' is pressed
                object.material.color.setHex(0xff0000); // there is also setHSV and setRGB
            }
        };

    } /*init end*/




    function bodymat() {

        var icolor = 0x085AA3;
        var ccolorr = document.getElementById('ccolorr');
        ccolorr.onclick = function() {
            icolor = 0xAC0000;
        }



        var bodymat = new THREE.MeshPhongMaterial({
            color: icolor,
            side: THREE.DoubleSide,
            specular: 0x111111,
            shininess: 10,
            envMap: envTex,
            combine: THREE.AddOperation,
            refractionRatio: 0.98,
            reflectivity: 0.1,

        })
        return bodymat;

    }



    function changeMap(newMap) {
        map = newMap;
        iwatchScreen.material.map = map;

    }



    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }






    function getpos1() {

        for (var i = 0; i < sm.length; i++) {
            var vspos = get_screen_xy(mynote.geometry.vertices[i], camera);
            sm[i].style.left = vspos.x - 16;
            sm[i].style.top = vspos.y - 16;
        };
    }




    function get_screen_xy(position, camera) {
        var pos = position.clone();
        projScreenMat = new THREE.Matrix4();
        projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        pos.applyProjection(projScreenMat);

        return {
            x: (pos.x + 1) * window.innerWidth / 2,
            y: (-pos.y + 1) * window.innerHeight / 2
        };
    }

    window.onload = function() {


        var tween = new TWEEN.Tween(iwatchgroup.position);
        tween.to({
            x: 0,
            y: 0,
            z: 0
        }, 2000);
        tween.start();

        var tweenR = new TWEEN.Tween(iwatchgroup.rotation);
        tweenR.to({
            x: 0,
            y: Math.PI * 2,
            z: 0
        }, 3000);
        tweenR.start();

        smf.addEventListener('mouseover', cameraf, false);

        function cameraf() {
            var tweenR = new TWEEN.Tween(camera.position);
            tweenR.to({
                x: 0,
                y: 3,
                z: 200,
            }, 2000);
            tweenR.start();

            camera.lookAt(mynote.geometry.vertices[0]);
        }

    }


    function pickobj() {

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {

            if (INTERSECTED != intersects[0].object) {

                if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);

                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex(Math.random() * 0xff0000);

            }

        } else {

            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = null;
        }
    }


    function animate() {
        requestAnimationFrame(animate);
        render();
        TWEEN.update();
    }



    function render() {

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            videoImageContext.drawImage(video, 0, 0);
            if (screenVideo)
                screenVideo.needsUpdate = true;
        }


        //iwatchgroup.rotation.y = Math.PI/4;

        screenVideo.needsUpdate = true;


        var basespeed = 0.02;
        var speed = basespeed * mouseX / 100;


        if (speed < 0.05 & speed > -0.005) {
            iwatchgroup.rotation.y = speed / 100;
        } else if (speed > 0.05) {
            iwatchgroup.rotation.y += speed;
        } else {
            iwatchgroup.rotation.y += speed;
        };


        camera.position.x += (mouseX - camera.position.x) * .1;
        camera.position.y += (-mouseY - camera.position.y) * .1;

        camera.lookAt(scene.position);
        renderer.render(scene, camera);


        raycaster.setFromCamera(mouse, camera);

        getpos1();
        /*getpos2();*/
        pickobj();
    }
