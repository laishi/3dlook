var app, canvas;

// 获取天空盒子6个级别的图片地址
var server = 'img/';
var images = [];

for (var level = 0; level < 6; level++) {

    for (var face = 0; face < 6; face++) {
        images.push('skyBox/grace_m0' + level + '_c0' + face + '.png')
    }
}

// 物体贴图，diffuse、metalness、gloass、normalMap

images.push('map/metal_d_1024.jpg');
images.push('map/metal_met_1024.jpg');
images.push('map/metal_g_1024.jpg');
images.push('map/metal_n_1024.png');

var numLoaded = 0;
var cubeMaps = [];
var shapes = [];

function loadImage(i) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = server + images[i];
    image.onload = function() {
        numLoaded++;
        if (numLoaded === images.length) {
            // 当资源都准备加载完成，接下来就初始化
            initialize();
        }
    };
    images[i] = image;
}


function loadImages() {
    for (var i = 0; i < images.length; i++) {
        loadImage(i);
    }
}





function createMaterial(d, s, g, n) {

    var mat = new pc.StandardMaterial();
    mat.shadingModel = pc.SPECULAR_BLINN;
    mat.diffuse.set(0.8, 0.8, 0.8);
    mat.specular.set(0.8, 0.8, 0.8);
    mat.specularAntialias = true;
    mat.diffuseMap = d;
    mat.specularMap = s;
    mat.glossMap = g;
    mat.normalMap = n;
    mat.shininess = 38;
    mat.conserveEnergy = true;
    mat.cubeMap = cubeMaps[1];
    mat.reflectivity = 0.03;
    mat.prefilteredCubeMap128 = cubeMaps[0];
    mat.prefilteredCubeMap64  = cubeMaps[1];
    mat.prefilteredCubeMap32  = cubeMaps[2];
    mat.prefilteredCubeMap16  = cubeMaps[3];
    mat.prefilteredCubeMap8   = cubeMaps[4];
    mat.prefilteredCubeMap4   = cubeMaps[5];
    mat.update();
    return mat;
}

loadImages();

function initialize() {

    // ***********    Initialize application   *******************
    var canvas = document.getElementById("application-canvas");

    // focus the canvas for keyboard input
    canvas.focus();

    // Create the application and start the update loop
    var app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(canvas)
    });

    app.start();

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);


    for (var mip = 0; mip < 6; mip++) {

        var cubeMap = new pc.Texture(app.graphicsDevice, {
            cubemap: true,
            rgbm: true,
            fixCubemapSeams:true,  //fixCubemapSeams 可以在控制台输入cubemap产看他的状态
            autoMipmap: true
        });

       cubeMap.setSource(images.slice(mip * 6, mip * 6 + 6));
        cubeMaps[mip] = cubeMap;
    }


    var metald = new pc.Texture(app.graphicsDevice);
    metald.setSource(images[36]);

    var metals = new pc.Texture(app.graphicsDevice);
    metals.setSource(images[37]);

    var metalg = new pc.Texture(app.graphicsDevice);
    metalg.setSource(images[38]);

    var metaln = new pc.Texture(app.graphicsDevice);
    metaln.setSource(images[39]);

    var metal = createMaterial(metald, metals, metalg, metaln);
    var chrome = createMaterial(null, null, null, null);


    app.scene.skybox = cubeMaps[0];
    app.scene.toneMapping = pc.TONEMAP_FILMIC;
    app.scene.exposure = 10;

    // camera

    var camera = new pc.Entity();
    camera.addComponent("camera", {
        clearColor: new pc.Color(0.5, 0.2, 0.2,0.0),
        nearClip: 0.3,
        farClip: 30
    });

    camera.addComponent("script", {
        scripts: [

            { url: 'js/camera.js' },
            { url: 'js/hammer.min.js' },

        ]
    })

    app.root.addChild(camera);
    camera.translate(0, 0, 1);

    var light = new pc.Entity();
    light.addComponent('light', { type: 'point' });
    light.setPosition(2, 2, 2);
    app.root.addChild(light);
    var light = new pc.Entity();
    light.addComponent('light', { type: 'point' });
    light.setPosition(-2, -2, -2);
    app.root.addChild(light);

    var loadFilename = "obj/shaveblender.json";

    // var cubeModel;

    app.assets.loadFromUrl(loadFilename, 'model', function (err, asset) {

        var cubeModel = new pc.Entity();

        if (err) {
            console.error(err);
            return;
        }

        cubeModel.addComponent("model");
        cubeModel.model.model = asset.resource;
        app.root.addChild(cubeModel);



        console.log(cubeModel.model.material)

        var model = cubeModel.model.model;
        model.meshInstances[0].material = chrome;

    });



    console.log(app.root._children)


    var cube = new pc.Entity();
    cube.addComponent('model', {
        type: 'box'
    });

    // app.root.addChild(cube);
    // cube.setPosition(0, -0.5, 0);



    var sphere = new pc.Entity();
    sphere.addComponent('model', {
        type: 'sphere'
    });

    sphere.setPosition(0, 1, 0);
    // app.root.addChild(sphere);


    cube.model.material = metal;
    sphere.model.material = chrome;

    // Register an update event to rotate the camera
    var timer = 0;
    app.on("update", function (dt) {
        // timer += dt;
        // camera.setPosition(0, 0, 0);
        app.root.rotate(0, 20 * dt, 0);
        // camera.translateLocal(0, 0, 5.5);
    });

    window.addEventListener('resize', function() {
        app.resizeCanvas(canvas.width, canvas.height);
    });

}
