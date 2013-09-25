var gt = {};
  

gt.Globe = function (container) {
  var Shaders = {
	'earth': {}
  };
  var camera, scene, renderer;
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
	addMesh();
  };

  function setCamera () {
    camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
    //camera.lookAt(scene.position);
    camera.position.z = 5;
    scene.add(camera);
  };

  function addMesh () {
  	var earthmap = "../images/earth_surface_2048.jpg";
  	var geometry = new THREE.SphereGeometry(1, 32, 32);
  	var texture = THREE.ImageUtils.loadTexture(earthmap)
  	var material = new THREE.MeshBasicMaterial( { map: texture } );
	var globe = new THREE.Mesh(geometry, material);

	scene.add(globe);
  };

  function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
  }

  init();
  
};