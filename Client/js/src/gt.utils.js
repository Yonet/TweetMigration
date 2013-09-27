gt.utils = {

	latLongToVector3: function  (lat, lon, radius, height) {
	    var phi = (90 - lat)*Math.PI/180;
	    var theta = (180 - lon)*Math.PI/180;
	    var x = -(radius) * Math.cos(phi) * Math.cos(theta);
	    var y = (radius) * Math.sin(phi);
	    var z = (radius) * Math.cos(phi) * Math.sin(theta);


	    return new THREE.Vector3(x,y,z);
	},

	addPoints: function (data) {

	    console.log('data is ' + data);
	    var particles = new THREE.Geometry();

	    var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0x990000, size: 20, map: THREE.ImageUtils.loadTexture( "../../images/particle.png" ),blending: THREE.AdditiveBlending, transparent:true});
	    for (var i = 0 ; i < data.length; i++) {

            console.log('data i' + data[i]);
	        var x = parseInt(data[i]['geo']['lon']);
	        var y = parseInt(data[i]['geo']['lat']);

	        console.log('x : ' + x + ' y : ' + y);


	        var position = this.latLongToVector3(y, x, 200, 30);
	        console.log(position['x'], position['y'], position['z']);
	        var particle = new THREE.Vector3(position['x'], position['y'], position['z']);
            particles.vertices.push(particle); 

	    }

	    return new THREE.ParticleSystem(particles, particleMaterial);

	    
	}
};