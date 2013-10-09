gt.App = function(options) {
	this.el = options.el;

	// Permanantly bind animate so we don't have to call it in funny ways
	this.animate = this.animate.bind(this);

	// Hold markers
	this.markers = [];

	// Track # of tweets
	this.count = 0;

	// Track time change for render loop
	this.lastTime = 0;

	// Create a container
	this.container = document.createElement('div');
	this.container.className = 'gt_container';
	this.el.appendChild(this.container);

	// Get width of element
	this.width = this.el.scrollWidth;
	this.height = this.el.scrollHeight;

	// Create renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(this.width, this.height);
	this.canvas = this.renderer.domElement;
	this.canvas.className = 'gt_canvas';
	
	// Add canvas to container
	this.container.appendChild(this.canvas);

	// Create an element for output
	this.output = document.createElement('div');
	this.output.className = 'gt_output';
	this.container.appendChild(this.output);

	// Create an overlay
	this.overlay = document.createElement('div');
	this.overlay.className = 'gt_overlay';
	this.overlay.style.display = 'none';
	this.container.appendChild(this.overlay);

	// Create the pause item
	this.paused = document.createElement('div');
	this.paused.className = 'gt_paused';
	this.overlay.appendChild(this.paused);

	// Create scene
	var scene = this.scene = new THREE.Scene();

	// Setup camera
	var camera = this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 100000);
	camera.position.z = -550;
	scene.add(camera);

	// Setup lights
	var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
	directionalLight.position.set(1, 0, 1);
	scene.add(directionalLight);

	var ambientLight = new THREE.AmbientLight(0x222222, 10);
	scene.add(ambientLight);

	var cameraLight = new THREE.PointLight(0xFFFFFF, 1, 2000);
	cameraLight.position.set(0, 0, 600);
	camera.add(cameraLight);

	// Add controls
	// this.controls = new THREE.TrackballControls(this.camera, this.el);
	this.controls = new THREE.OrbitControls(this.camera, this.el);

	// Add globe
	this.globe = new gt.Globe({
		scene: scene,
		radius: gt.config.earthRadius,
		cloudRadius: gt.config.cloudRadius,
		cloudSPeed: gt.config.cloudSpeed
	});

	// Add skybox
	this.skybox = new gt.Skybox({
		scene: scene,
		path: '/images/skybox',
		prefix: 'Purple_Nebula_'
	});

	// Add heatmap
	this.heatmap = new gt.Heatmap({
		scene: scene,
		radius: gt.config.earthRadius + 1,
		size: 8,
		intensity: 0.75,
		doBlur: true,
		decayFactor: 0.99999
	});

	// Add listeners
	window.addEventListener('resize', this.handleWindowResize.bind(this));
	window.addEventListener('blur', this.handleBlur.bind(this));
	window.addEventListener('focus', this.handleFocus.bind(this));

	this.connect();

	// Start animation
	this.animate(0);
};

gt.App.prototype.handleBlur = function() {
	this.overlay.style.display = '';
	this.disconnect();
};
gt.App.prototype.handleFocus = function() {
	this.overlay.style.display = 'none';
	this.reconnect();
};

gt.App.prototype.addStats = function() {
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.top = '0px';
	this.container.appendChild(this.stats.domElement);
};

gt.App.prototype.handleWindowResize = function() {
	// Remove ourselves from the equation to get a valid measurement
	this.canvas.style.display = 'none';

	this.width = this.el.scrollWidth;
	this.height = this.el.scrollHeight;
	this.camera.aspect = this.width / this.height;
	this.camera.updateProjectionMatrix();

	var ratio = window.devicePixelRatio || 1;

	this.renderer.setSize(this.width * ratio, this.height * ratio);
	this.camera.updateProjectionMatrix();

	this.canvas.style.display = 'block';
};


gt.App.prototype.animate = function(time) {
	var timeDiff = time - this.lastTime;
	this.lastTime = time;

	// Update hooked functions
	this.controls.update();
	this.heatmap.update(timeDiff, time);
	this.globe.update(timeDiff, time);

	// this.camera.lookAt(this.scene.position);
	this.render();
	requestAnimationFrame(this.animate);

	if (this.stats)
		this.stats.update();
};

gt.App.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
};

gt.App.prototype.addMarker = function(data) {
	// Create a new marker instance
	var marker = new gt.Marker({
		user: data.user,
		tweet: data.tweet,
		location: data.location,
		radius: gt.config.markerRadius,
		scene: this.scene
	});

	// Store instance
	this.markers.push(marker);
};

gt.App.prototype.connect = function() {
	this.socket = io.connect();

	// Add markers when the server emits them
	this.socket.on('marker', this.add.bind(this));
};

gt.App.prototype.reconnect = function() {
	this.socket.socket.connect();
};

gt.App.prototype.disconnect = function() {
	this.socket.socket.disconnect();
};

gt.App.prototype.add = function(data) {
	this.count++;

	this.output.innerText = this.count;

	this.heatmap.add(data);
	// this.addMarker(data); // Markers are very, very slow
};

gt.App.prototype.addTestData = function() {
	this.add({
		label: 'SF',
		location: [37.7835916, -122.4091141]
	});

	for (var lat = -90; lat <= 90; lat += 15) {
		for (var lon = -180; lon < 180; lon += 15) {
			this.add({
				location: [lat, lon]
			});
		}
	}
};
