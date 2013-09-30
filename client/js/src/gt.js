var gt = {};

// var fs = require('fs');


gt.Globe = function (container,data) {

  var camera, scene, light, renderer, controls, earth,tweets, cloud;
  var w = window.innerWidth,
      h = window.innerHeight;
  var data = [
    {name: 'Istanbul',
    "geo":{"lat":41.005462,"lon": 28.974853}},
    {name: 'SF',
    "geo":{"lat": 37.7835916,"lon": -122.4091141}},
    {name: 'North Pole', 
    "geo":{"lat":90,"lon": 0.0}},
    {name: 'equator near columbia', 
    "geo":{"lat":0.0,"lon": 0.0}},
    {name: 'equator near columbia', 
    "geo":{"lat":-34,"lon": 151}}
  ];

  function init () {
	
    setScene();
    setCamera();
    setRenderer();
    addController();
    render();

  };
  //initialize renderer
  function setRenderer () {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( w, h );
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( renderer.domElement );
    //container.appendChild( stats.domElement );

  };
  //initialize scene and lights
  function setScene () {

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( 1, 0 , 1);
    scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1 , -1);
    scene.add( light );
    light = new THREE.AmbientLight( 0x222222, 10);
    scene.add( light );
    addMesh();

  };
  //initialize camera
  function setCamera () {

    camera = new THREE.PerspectiveCamera( 60, w / h, 0.1, 20000 );
    camera.position.z = 500;
    light = new THREE.PointLight( 0xffffff, 1, 10000);
    light.position.set(0, 0, 600);
    camera.add( light );
    scene.add(camera);

  };
  //initialize trackball controller
  function addController () {

    controls = new THREE.TrackballControls( camera,  container);

  };
  //initialize globe and clouds, add points
  function addMesh () {

    var geometry = new THREE.SphereGeometry(200, 40, 30);
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('images/earth_surface_2048.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('images/bump_earth.jpg');
    material.bumpScale = 4;
    material.specularMap = THREE.ImageUtils.loadTexture('images/earth_specular_2048.jpg');
    var globe = new THREE.Mesh(geometry, material);
    globe.updateMatrix();
    globe.matrixAutoUpdate = false;
    var cloudGeometry   = new THREE.SphereGeometry(205, 32, 32);
    //cloud material
    var material  = new THREE.MeshPhongMaterial({
      map     : THREE.ImageUtils.loadTexture('images/earth_clouds_1024.png'),
      side        : THREE.DoubleSide,
      opacity     : 0.8,
      transparent : true,
      depthWrite  : false

    });

    var cloudMesh = new THREE.Mesh(cloudGeometry, material);
    cloud = new THREE.Object3D();
    cloud.add(cloudMesh);
    earth = new THREE.Object3D();
    earth.rotation.z = 0.41;
    earth.add(globe);
    
    tweets = gt.utils.addPoints(data);
    earth.add(tweets);
    scene.add(cloud);
    scene.add(earth);

  };

  //window resize
  function onWindowResize () {
    
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    var ratio = window.devicePixelRatio || 1;

    renderer.setSize( w*ratio, h*ratio );
    camera.updateProjectionMatrix();

    render();

  };

  function animate () {

    requestAnimationFrame( animate );
    controls.update();
    render();

  };
  
  function render () {

    camera.lookAt( scene.position );
    cloud.rotation.y += 0.008;
    earth.rotation.y += 0.005;
    renderer.render( scene, camera );
    stats.update();

  }

  init();
  animate();
  
};