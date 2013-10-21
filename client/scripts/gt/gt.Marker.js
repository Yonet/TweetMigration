gt.Marker = function(options) {
	this.location = gt.util.latLongToVector3(options.location[0], options.location[1], options.radius);

	var geometry = new THREE.SphereGeometry(1);
	var material = new THREE.MeshPhongMaterial({
		specular: '#ffa500', // Light
		color: '#ffa500', // Medium
		emissive: '#110000', // Dark
		shininess: 100 
	});

	this.mesh = new THREE.Mesh(geometry, material);
	this.mesh.position = this.location;

	options.scene.add(this.mesh)
};
