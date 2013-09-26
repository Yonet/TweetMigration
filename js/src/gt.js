var gt = {};


gt.Globe = function (container) {
  var data = ['41.0136', '28.9550', '200', '30'];
  var camera, scene, light, renderer, controls, earth,tweets;
  var w = window.innerWidth,
      h = window.innerHeight;

  function init () {
	
  	setScene();
  	setCamera();
  	setRenderer();
    addController();
    tweets = gt.utils.addPoints(data);
    scene.add(tweets);
    //addSkybox();
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
    //container.appendChild( stats.domElement );

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
    light = new THREE.AmbientLight( 0x222222, 10);
  	scene.add( light );
  	addMesh();

  };

  function setCamera () {

    camera = new THREE.PerspectiveCamera( 60, w / h, 0.1, 20000 );
    camera.position.z = 500;
    scene.add(camera);

  };

  function addController () {

    controls = new THREE.TrackballControls( camera,  container);

  };

  function addMesh () {

    var geometry = new THREE.SphereGeometry(200, 40, 30);
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('../images/earth_surface_2048.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('../images/bump_earth.jpg');
    material.bumpScale = 5;
    material.specularMap = THREE.ImageUtils.loadTexture('../images/earth_specular_2048.jpg');
	  var globe = new THREE.Mesh(geometry, material);
    globe.updateMatrix();
    globe.matrixAutoUpdate = false;
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
    // earth.rotation.z = 0.41;
  	earth.add(globe);
  	earth.add(cloudMesh);
  	scene.add(earth);

  };

  // function addSkybox () {
  //     var urlPrefix = "../images/skybox/Purple_Nebula_";
  //     var urls = [
  //         urlPrefix + "right1.png", urlPrefix + "left2.png",
  //         urlPrefix + "top3.png", urlPrefix + "bottom4.png",
  //         urlPrefix + "front5.png", urlPrefix + "back6.png"
  //     ];

  //     THREE.ImageUtils.loadTextureCube(urls, {}, function(textureCube) {
  //         textureCube.format = THREE.RGBFormat;
  //         var shader = THREE.ShaderLib.cube;

  //         var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  //         uniforms.tCube.value = textureCube;

  //         var material = new THREE.ShaderMaterial( {
  //             fragmentShader: shader.fragmentShader,
  //             vertexShader: shader.vertexShader,
  //             uniforms: uniforms,
  //             side: THREE.BackSide
  //         } );
  //         skyboxMesh = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000, 1, 1, 1, null, true ), material );
  //         scene.add( skyboxMesh );
  //     };}

  function onWindowResize () {

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize( w, h );

    render();

  };

  function animate () {

    requestAnimationFrame( animate );
    controls.update();
    render();

  };
  
  function render () {

    camera.lookAt( scene.position );
    tweets.rotation.y +=0.001;
    earth.rotation.y -= 0.005;
    renderer.render( scene, camera );
    stats.update();

  }

  init();
  animate();
  
};