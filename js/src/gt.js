var gt = {};
  

gt.Globe = function (container) {
  var Shaders = {
	'earth': {}
  };
  
  var camera, scene, light, renderer, controls, earth;
  var w = window.innerWidth,
      h = window.innerHeight;

  function init () {
	
  	setScene();
  	setCamera();
  	setRenderer();
    addController();
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
  	light = new THREE.PointLight( 0xffffff, 2, 10000);
  	light.position.set(0, 0, 600);
    scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( 1, 0 , 1);
    scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1 , -1);
    scene.add( light );
    light = new THREE.AmbientLight( 0x222222, 5);
  	scene.add( light );
  	addMesh();

  };

  function setCamera () {

    camera = new THREE.PerspectiveCamera( 60, w / h, 0.1, 2000 );
    camera.position.z = 500;
    scene.add(camera);

  };

  function addController () {

    controls = new THREE.TrackballControls( camera,  container);

  };

  function addMesh () {

    var geometry = new THREE.SphereGeometry(200, 32, 32);
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('../images/earth_surface_2048.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('../images/bump_earth.jpg');
    material.bumpScale = 5;
    material.specularMap = THREE.ImageUtils.loadTexture('../images/earth_specular_2048.jpg');
	  var globe = new THREE.Mesh(geometry, material);
    globe.updateMatrix();
    globe.matrixAutoUpdate = false;
    globe.rotation.z = 0.41;
    var cloudGeometry   = new THREE.SphereGeometry(205, 32, 32);
	  var material  = new THREE.MeshPhongMaterial({
	  map     : THREE.ImageUtils.loadTexture('../images/earth_clouds_1024.png'),
	  side        : THREE.DoubleSide,
	  opacity     : 0.8,
	  transparent : true,
	  depthWrite  : false

	  });

  	var cloudMesh = new THREE.Mesh(cloudGeometry, material);
    earth = new THREE.Object3D();
  	earth.add(globe);
  	earth.add(cloudMesh);
  	scene.add(earth);

  };

  function onWindowResize() {

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize( w, h );

    render();

  };

  function animate() {

    requestAnimationFrame( animate );
    controls.update();
    render();

  };

  function render() {

    camera.lookAt( scene.position );
    earth.rotation.y -= 0.005;
    renderer.render( scene, camera );
    stats.update();

  }

  init();
  animate();
  
};