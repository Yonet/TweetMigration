gt.Skybox = function(options) {
	gt.util.extend(this, gt.Skybox.defaults, options);

	var urlPrefix = this.path+'/'+this.prefix;

	var urls = [
		urlPrefix + 'right1.png', urlPrefix + 'left2.png',
		urlPrefix + 'top3.png', urlPrefix + 'bottom4.png',
		urlPrefix + 'front5.png', urlPrefix + 'back6.png'
	];

	var self = this;
	THREE.ImageUtils.loadTextureCube(urls, {}, function(textureCube) {
		textureCube.format = THREE.RGBFormat;
		var shader = THREE.ShaderLib.cube;

		var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
		uniforms.tCube.value = textureCube;

		var material = new THREE.ShaderMaterial({
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: uniforms,
			side: THREE.BackSide
		});

		self.mesh = new THREE.Mesh(new THREE.CubeGeometry(self.size, self.size, self.size, 1, 1, 1, null, true), material);

		// Since the skybox is static, disable auto-updating of its matrix
		self.mesh.matrixAutoUpdate = false;
		self.mesh.updateMatrix();

		self.scene.add(self.mesh);
	});
};

gt.Skybox.defaults = {
	size: 30000,
	path: '/images/skybox',
	prefix: 'Skybox_'
};
