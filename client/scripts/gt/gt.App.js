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
	this.lastSunAlignment = 0;

	// Track loaded status
	this.loaded = false;

	// Create a container
	// Create an element for output
	this.el.insertAdjacentHTML('beforeend', document.getElementById('gt_template').innerHTML);
	this.container = this.el.querySelector('.gt_container');
	this.countEl = this.container.querySelector('.gt_count');
	this.overlay = this.container.querySelector('.gt_overlay');
	this.indicator = this.container.querySelector('.gt_indicator');
	this.output = this.container.querySelector('.gt_output');

	// Listen to visualization type change
	this.container.querySelector('.gt_heatmapType').addEventListener('change', function(evt) {
		this.heatmap.set(gt.config.heatmap[evt.target.value]);
	}.bind(this));

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

	// Create scene
	var scene = this.scene = new THREE.Scene();

	// Setup camera
	var camera = this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 100000);
	camera.position.z = -550;
	scene.add(camera);

	// Setup lights
	this.directionalLight =  new THREE.DirectionalLight(0xFFFFFF);
	scene.add(this.directionalLight);

	this.ambientLight = new THREE.AmbientLight(0x222222, 10);
	scene.add(this.ambientLight);

	var cameraLight = new THREE.PointLight(0xFFFFFF, 1, 1500);
	cameraLight.position.set(0, 0, gt.config.cameraDistance);
	camera.add(cameraLight);

	// Add controls
	// this.controls = new THREE.TrackballControls(this.camera, this.el);
	this.controls = new THREE.OrbitControls(this.camera, this.el);

	// Show spinner
	this.showSpinner();

	// Add globe
	this.globe = new gt.Globe({
		scene: scene,
		radius: gt.config.earthRadius,
		cloudRadius: gt.config.cloudRadius,
		cloudSpeed: gt.config.cloudSpeed,
		loaded: this.handleLoaded.bind(this)
	});

	// Add skybox
	this.skybox = new gt.Skybox({
		scene: scene,
		path: '/images/skybox',
		prefix: 'Purple_Nebula_'
	});

	var heatmapConfig = gt.config.heatmap[gt.config.heatmapStyle];

	// Add heatmap
	this.heatmap = new gt.Heatmap({
		scene: scene,
		radius: gt.config.earthRadius + 1,
		fps: heatmapConfig.fps,
		size: heatmapConfig.size,
		intensity: heatmapConfig.intensity,
		doBlur: heatmapConfig.doBlur,
		decayFactor: heatmapConfig.decayFactor
	});

	// Add listeners
	window.addEventListener('resize', this.handleWindowResize.bind(this));
	window.addEventListener('blur', this.handleBlur.bind(this));
	window.addEventListener('focus', this.handleFocus.bind(this));

	this.connect();

	// Start animation
	this.animate(0);

	this.setSunPosition();

	// Ask for and watch user's position
	navigator.geolocation.watchPosition(this.handleGeolocationChange.bind(this));

	// Addd debug information
	if (gt.config.debug)
		this.addStats();
};

// Animation
gt.App.prototype.animate = function(time) {
	var timeDiff = time - this.lastTime;
	this.lastTime = time;

	// Update hooked functions
	this.controls.update();
	this.heatmap.update(timeDiff, time);
	this.globe.update(timeDiff, time);

	// Re-align the sun every minute
	if (time - this.lastSunAlignment > 1000*60) {
		this.setSunPosition();
		this.lastSunAlignment = time;
	}

	// Slowly set time for today's date
	// this.setSunPosition(gt.util.getDOY(), time / 1000 % 24);

	// Test year + day
	// this.setSunPosition(time / 100 % 365, time / 24 % 24);

	this.render();
	requestAnimationFrame(this.animate);

	if (this.stats)
		this.stats.update();
};

gt.App.prototype.setSunPosition = function(dayOfYear, utcHour) {
	if (typeof dayOfYear === 'undefined' || typeof dayOfYear === 'undefined') {
		var d = new Date();
		dayOfYear = gt.util.getDOY(d);
		utcHour = d.getUTCHours();
	}

	var sunFraction = utcHour / 24;

	// Calculate the longitude based on the fact that the 12th hour UTC should be sun at 0° latitude
	var sunLong = sunFraction * -360 + 180;

	// Calculate declination angle
	// Via http://pveducation.org/pvcdrom/properties-of-sunlight/declination-angle
	var sunAngle = 23.45*Math.sin(gt.util.deg2rad(360/365 * (dayOfYear-81)));

	// Calcuate the 3D position of the sun
	var sunPos = gt.util.latLongToVector3(sunAngle, sunLong, 1500);
	this.directionalLight.position.copy(sunPos);

	// console.log('%s on %d day of year: Sun at longitude %s, angle %s', utcHour.toFixed(3), dayOfYear, sunLong.toFixed(3), sunAngle.toFixed(3));
};

gt.App.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
};

// Marker management
gt.App.prototype.add = function(data) {
	this.count++;

	this.countEl.innerText = this.count;

	this.heatmap.add(data);
	// this.addMarker(data); // Markers are very, very slow
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

gt.App.prototype.rotateTo = function(pos) {
	// TODO: Animate rotation smoothly
	this.camera.position = gt.util.latLongToVector3(pos.coords.latitude, pos.coords.longitude, gt.config.cameraDistance);
	this.camera.lookAt(this.scene.position);
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
	this.socket.disconnect();
};

gt.App.prototype.showOverlay = function(type) {
	this.overlay.classList.remove('hide');
	if (type)
		this.indicator.className = 'gt_'+type;
};

gt.App.prototype.hideOverlay = function(type) {
	this.overlay.classList.add('hide');
	if (type)
		this.indicator.className = 'gt_'+type;
};

// Handlers
gt.App.prototype.showSpinner = function() {
	this.showOverlay('loading');
};

gt.App.prototype.hideSpinner = function() {
	this.hideOverlay('loading');
};

gt.App.prototype.handleLoaded = function() {
	this.hideSpinner();
	this.loaded = true;
};

gt.App.prototype.handleBlur = function() {
	if (gt.config.pauseOnBlur && this.loaded) {
		this.showOverlay('paused');
		this.disconnect();
	}
};

gt.App.prototype.handleFocus = function() {
	if (gt.config.pauseOnBlur && this.loaded) {
		this.hideOverlay('paused');
		this.reconnect();
	}
};

gt.App.prototype.handleGeolocationChange = function(pos) {
	this.rotateTo(pos);
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

// Debug methods
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

gt.App.prototype.addStats = function() {
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.top = '0px';
	this.container.appendChild(this.stats.domElement);
};