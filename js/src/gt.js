var gt = {};
  

gt.Globe = function (container) {
  var Shaders = {
	'earth': {}
  };
  var camera, scene, light, renderer;
  var w = window.innerWidth,
      h = window.innerHeight;

  function init () {
	
	setScene();
	setCamera();
	setRenderer();
	render();
  };

  function setRenderer () {

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( w, h );
	container.appendChild( renderer.domElement );
  };

  function setScene () {

	scene = new THREE.Scene();
	light = new THREE.PointLight( 0xffffff, 2, 100);
	light.position.set(-10, 0, 20);
	scene.add( light );
	addMesh();
  };

  function setCamera () {

    camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
    camera.position.z = 5;
    scene.add(camera);
  };

  function addMesh () {

    var geometry = new THREE.SphereGeometry(2, 32, 32);
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('../images/earth_surface_2048.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('../images/bump_earth.jpg');
    material.bumpScale = 0.05;
    material.specularMap = THREE.ImageUtils.loadTexture('../images/earth_specular_2048.jpg');
    //material.specular = { color: 0xbbbbbb};
	var globe = new THREE.Mesh(geometry, material);
    globe.rotation.z = 0.41;
    var cloudGeometry   = new THREE.SphereGeometry(2.05, 32, 32);
	var material  = new THREE.MeshPhongMaterial({
	  map     : THREE.ImageUtils.loadTexture('../images/earth_clouds_1024.png'),
	  side        : THREE.DoubleSide,
	  opacity     : 0.8,
	  transparent : true,
	  depthWrite  : false,
	})
	var cloudMesh = new THREE.Mesh(cloudGeometry, material);
	
    var earth = new THREE.Object3D();
	earth.add(globe);
	earth.add(cloudMesh);
	scene.add(earth);

  };

  function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
  }

  init();
  
};