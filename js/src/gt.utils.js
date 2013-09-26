gt.utils = {

	latLongToVector3: function  (lat, lon, radius, heigth) {
	    var phi = (lat)*Math.PI/180;
	    var theta = (lon-180)*Math.PI/180;
	    var x = -(radius+heigth) * Math.cos(phi) * Math.cos(theta);
	    var y = (radius+heigth) * Math.sin(phi);
	    var z = (radius+heigth) * Math.cos(phi) * Math.sin(theta);

	    return new THREE.Vector3(x,y,z);
	},

	addPoints: function (data) {

	    
	    var particles = new THREE.Geometry();

	    var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0x990000, size: 20, map: THREE.ImageUtils.loadTexture( "../../images/particle.png" ),blending: THREE.AdditiveBlending, transparent:true});
	    for (var i = 0 ; i < data.length; i++) {


	        var x = parseInt(data[i][0])+180;
	        var y = parseInt((data[i][1])-84)*-1;


	        var position = this.latLongToVector3(y, x, 205, 40);
	        var particle = new THREE.Vector3(position['x'], position['y'], position['z']);
            particles.vertices.push(particle); 

	    }

	    return new THREE.ParticleSystem(particles, particleMaterial);

	    
	}
};