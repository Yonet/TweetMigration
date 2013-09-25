var gt = {};
  

gt.Globe = function (container) {
  var Shaders = {
	'earth': {}
  };
  var camera, scene, light, renderer, controls;
  var w = window.innerWidth,
      h = window.innerHeight;

  function init () {
	
  	setScene();
  	setCamera();
    addController();
  	setRenderer();
  	render();

  };

  function setRenderer () {

  	renderer = new THREE.WebGLRenderer();
  	renderer.setSize( w, h );
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
  	container.appendChild( renderer.domElement );
    container.appendChild( stats.domElement );
  };

  function setScene () {

  	scene = new THREE.Scene();
  	light = new THREE.PointLight( 0xffffff );
  	light.position.set(100, 0, -500);
    scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( 1, 0 , 1);
    scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1 , -1);
    scene.add( light );
    light = new THREE.AmbientLight( 0x222222 );
  	scene.add( light );
  	addMesh();

  };

  function setCamera () {

    camera = new THREE.PerspectiveCamera( 60, w / h, 0.1, 1000 );
    camera.position.z = 500;
    scene.add(camera);

  };

  function addController () {

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

  };

  function addMesh () {

    var geometry = new THREE.SphereGeometry(200, 32, 32);
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('../images/earth_surface_2048.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('../images/bump_earth.jpg');
    material.bumpScale = 0.5;
    material.specularMap = THREE.ImageUtils.loadTexture('../images/earth_specular_2048.jpg');
	  var globe = new THREE.Mesh(geometry, material);
    globe.updateMatrix();
    globe.matrixAutoUpdate = false;
    globe.rotation.z = 0.41;
    var cloudGeometry   = new THREE.SphereGeometry(200.5, 32, 32);
	  var material  = new THREE.MeshPhongMaterial({
	  map     : THREE.ImageUtils.loadTexture('../images/earth_clouds_1024.png'),
	  side        : THREE.DoubleSide,
	  opacity     : 0.8,
	  transparent : true,
	  depthWrite  : false,

	  });

  	var cloudMesh = new THREE.Mesh(cloudGeometry, material);
  	
    var earth = new THREE.Object3D();
  	earth.add(globe);
  	earth.add(cloudMesh);
  	scene.add(earth);

  };

  function onWindowResize() {

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize( w, h );

    controls.handleResize();

    render();

  };

  function animate() {

    requestAnimationFrame( animate );
    controls.update();

  };

  function render() {

    renderer.render( scene, camera );
    stats.update();

  }

  init();
  animate();
  
};