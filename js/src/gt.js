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
	scene.add( new THREE.PointLight( 0xffffff, 2, 100) );
	// light.position.set(-10, 0, 20);
	addMesh();
  };

  function setCamera () {

    camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
    //camera.lookAt(scene.position);
    camera.position.z = 5;
    scene.add(camera);
  };

  function addMesh () {

    var surfaceMap = THREE.ImageUtils.loadTexture( "../images/earth_surface_2048.jpg" );
	var normalMap = THREE.ImageUtils.loadTexture( "../images/earth_normal_2048.jpg" );
	var specularMap = THREE.ImageUtils.loadTexture( "../images/earth_specular_2048.jpg" );

	var shader = THREE.ShaderLib[ "normalmap" ];
	uniforms = THREE.UniformsUtils.merge( shader.uniforms );

	uniforms["tNormal"] = { texture: normalMap };
	uniforms[ "tDiffuse" ] = { texture: surfaceMap };
	uniforms[ "tSpecular" ] = { texture: specularMap };

	uniforms[ "enableDiffuse" ] = { type: "i", value: true };
	uniforms[ "enableSpecular" ] = { type: "i", value: true };

	var shaderMaterial = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: uniforms,
		lights: true
	});
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    geometry.computeTangents();
	var globe = new THREE.Mesh(geometry, shaderMaterial);
    globe.rotation.z = 0.41;
    var earth = new THREE.Object3D();
	earth.add(globe);
	scene.add(earth);
  };

  function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
  }

  init();
  
};