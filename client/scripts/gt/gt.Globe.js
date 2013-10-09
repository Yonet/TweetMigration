gt.Globe = function(options) {
	// Store options
	gt.util.extend(this, gt.Globe.defaults, options);

	// Setup globe mesh
	var globeGeometry = new THREE.SphereGeometry(this.radius, 40, 30);
	var globeMaterial = new THREE.MeshPhongMaterial();
	globeMaterial.map = THREE.ImageUtils.loadTexture('/images/globe/earthmap4k.jpg');
	// globeMaterial.map = THREE.ImageUtils.loadTexture('/images/globe/earthgrid.png'); // Lat/Long grid
	globeMaterial.bumpMap = THREE.ImageUtils.loadTexture('/images/globe/earthbump4k.jpg');
	globeMaterial.bumpScale = 4;
	// globeMaterial.specularMap = THREE.ImageUtils.loadTexture('/images/globe/earth_specular_2048.jpg');
	this.globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);

	// Since the earth is static, disable auto-updating of its matrix
	this.globeMesh.matrixAutoUpdate = false;
	this.globeMesh.updateMatrix();

	// Setup cloud mesh
	var cloudGeometry = new THREE.SphereGeometry(this.cloudRadius, 32, 32);
	var cloudMaterial = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture('/images/globe/earthclouds4k.png'),
		side: THREE.DoubleSide,
		opacity: 0.8,
		transparent: true,
		depthWrite: false
	});
	this.cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

	// Initialize root object
	this.root = new THREE.Object3D();

	// Add objects to root object
	this.root.add(this.globeMesh);
	this.root.add(this.cloudMesh);

	// Add root to scene
	this.scene.add(this.root);
};

gt.Globe.defaults = {
	radius: 200,
	cloudRadius: 205,
	cloudSpeed: 0.000005
};

gt.Globe.prototype.update = function(time) {
	// Gently rotate the clouds around the earth as a function of time passed
	this.cloudMesh.rotation.y += time * this.cloudSpeed;
};
