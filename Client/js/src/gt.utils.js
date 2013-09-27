gt.utils = {

    latLongToVector3: function  (lat, lon, radius) {
	  var phi = lat*Math.PI/180;//lon
	  var theta = lon*Math.PI/180;//lat

      var x = radius * Math.cos(phi) * Math.cos(theta);//lon
	  var y = radius * Math.cos(phi) * Math.sin(theta);//lat
	  var z = radius * Math.sin(phi);

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


	        var position = this.latLongToVector3( x, y, 200);
	        console.log(position['x'], position['y'], position['z']);
	        var particle = new THREE.Vector3(position['x'], position['y'], position['z']);
            particles.vertices.push(particle); 

	    }

	    return new THREE.ParticleSystem(particles, particleMaterial);

	    
	}
};