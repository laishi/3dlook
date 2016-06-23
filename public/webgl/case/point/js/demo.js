var container;
var camera, scene, renderer, particles, geometry, materials = [],
  parameters, i, h, color, size, cube;
var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.00003);

  geometry = new THREE.Geometry();

  for (i = 0; i < 1000; i++) {

    var vertex = new THREE.Vector3();

    var angle = 0.1 * i;
    var temp_x = (1 + angle) * Math.cos(angle);
    var temp_y = (1 + angle) * Math.sin(angle);
    vertex.x = temp_x; //Math.random() * 1000 - 500;
    vertex.y = Math.random() * 2000 - 1000;
    vertex.z = temp_y; //Math.random() * 1000 - 500;

    geometry.vertices.push(vertex);

  }

  for (i = 0; i < 2500; i++) {

    var vertex = new THREE.Vector3();

    var angle = 0.6 * i;
    var temp_x = (1 + angle) * Math.cos(angle);
    var temp_y = (1 + angle) * Math.sin(angle);
    vertex.x = temp_x; //Math.random() * 1000 - 500;
    vertex.y = Math.random() * 50 - 25;
    vertex.z = temp_y; //Math.random() * 1000 - 500;

    geometry.vertices.push(vertex);

  }

  for (i = 0; i < 2500; i++) {

    var vertex = new THREE.Vector3();

    var angle = 0.61 * i;
    var temp_x = (1 + angle) * Math.cos(angle);
    var temp_y = (1 + angle) * Math.sin(angle);
    vertex.x = temp_x; //Math.random() * 1000 - 500;
    vertex.y = Math.random() * 100 - 50;
    vertex.z = temp_y; //Math.random() * 1000 - 500;

    geometry.vertices.push(vertex);

  }

  for (i = 0; i < 3500; i++) {

    var vertex = new THREE.Vector3();

    var angle = 0.5 * i;
    var temp_x = (1 + angle) * Math.cos(angle);
    var temp_y = (1 + angle) * Math.sin(angle);
    vertex.x = temp_x; //Math.random() * 1000 - 500;
    vertex.y = Math.random() * 300 - 150;
    vertex.z = temp_y; //Math.random() * 1000 - 500;

    geometry.vertices.push(vertex);

  }

  for (i = 0; i < 2500; i++) {

    var vertex = new THREE.Vector3();

    var angle = 0.05 * i;
    var temp_x = (1 + angle) * Math.cos(angle);
    var temp_y = (1 + angle) * Math.sin(angle);
    vertex.x = temp_x; //Math.random() * 1000 - 500;
    vertex.y = Math.random() * i - (i * 0.5);
    vertex.z = temp_y; //Math.random() * 1000 - 500;

    geometry.vertices.push(vertex);

  }

  for (i = 0; i < 1000; i++) {

    var vertex = new THREE.Vector3();

    var angle = 0.01 * i;
    var temp_x = (1 + angle) * Math.cos(angle);
    var temp_y = (1 + angle) * Math.sin(angle);
    vertex.x = temp_x; //Math.random() * 1000 - 500;
    vertex.y = Math.random() * i - (i * 0.5);
    vertex.z = temp_y; //Math.random() * 1000 - 500;

    geometry.vertices.push(vertex);

  }

  parameters = [
    [
      [0, 1, 0.5], 1.5
    ],
    [
      [0.95, 2, 0.5], 1.5
    ],
    [
      [0.90, 3, 0.5], 1.5
    ],
    [
      [0.85, 4, 0.5], 1.5
    ],
    [
      [0.80, 5, 0.5], 1.5
    ]
  ];

  for (i = 0; i < parameters.length; i++) {

    color = parameters[i][0];
    size = parameters[i][1];

    materials[i] = new THREE.PointCloudMaterial({
      size: size
    });

    particles = new THREE.PointCloud(geometry, materials[i]);

    particles.rotation.x = 1;
    particles.rotation.y = 4;
    particles.rotation.z = 0.05;

    scene.add(particles);

  }

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

  if (event.touches.length === 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

  }

}

function onDocumentTouchMove(event) {

  if (event.touches.length === 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

  }

}

//

function animate() {

  requestAnimationFrame(animate);

  render();

}

function render() {

  var time = Date.now() * 0.00005;

  camera.position.x += (mouseX - camera.position.x) * 0.007;
  camera.position.y += (-mouseY - camera.position.y) * 0.007;

  camera.lookAt(scene.position);

  for (i = 0; i < scene.children.length; i++) {

    var object = scene.children[i];

    if (object instanceof THREE.PointCloud) {

      //object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
      object.rotation.y = time * (i < 6 ? i + 1 : -(i + 1));
      object.rotation.x = time * 0.1;

    }

  }

  for (i = 0; i < materials.length; i++) {

    color = parameters[i][0];

    h = (360 * (color[0] + time) % 360) / 360;
    materials[i].color.setHSL(h, color[1], color[2]);

  }

  renderer.render(scene, camera);

}