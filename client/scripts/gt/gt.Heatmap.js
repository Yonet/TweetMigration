gt.Heatmap = function(options) {
	gt.util.extend(this, this.constructor.defaults, options);

	this.canvas = document.createElement('canvas');

	this.heatmap = createWebGLHeatmap({
		canvas: this.canvas,
		width: this.width,
		height: this.height
	});

	// Create a texture
	var texture = this.texture = new THREE.Texture(this.canvas);

	// Pick up a few FPS with constant texture updates
	// Via https://github.com/mrdoob/three.js/issues/2233
	texture.premultiplyAlpha = true;

	// Setup mesh
	this.geometry = new THREE.SphereGeometry(this.radius, 40, 30);
	this.material = new THREE.MeshPhongMaterial({
		map: this.texture,
		transparent: true,
		depthWrite: false
	});
	this.mesh = new THREE.Mesh(this.geometry, this.material);

	// Since the heatmap is static, disable auto-updating of its matrix
	this.mesh.matrixAutoUpdate = false;
	this.mesh.updateMatrix();

	// Add to scene
	this.scene.add(this.mesh);
};

gt.Heatmap.defaults = {
	width: 1024,
	height: 512,
	radius: 200,
	size: 8,
	intensity: 0.05,
	decayFactor: 0.9999,
	doBlur: false
};

gt.Heatmap.prototype.add = function(data) {
	var pos = gt.util.latLongTo2dCoordinate(data.location[0], data.location[1], this.width, this.height)

	this.heatmap.addPoint(pos.x, pos.y, this.size, this.intensity);

	// Tell THREE to update the texture from the canvas
	// Commented out due to smooth hack
	// this.texture.needsUpdate = true;
};

gt.Heatmap.prototype.update = function(timeDiff, time) {
	// Smooth hack: In order to make the heatmap smoothly decay
	// We must add a dummy point
	this.heatmap.addPoint(0, 0, 0, 0);
	this.texture.needsUpdate = true;

	// TODO: Do blur and decay consistently for lower FPS
	if (this.doBlur)
		this.heatmap.blur();

	if (this.decayFactor)
		this.heatmap.multiply(this.decayFactor);

	this.heatmap.update();
	this.heatmap.display();
};
