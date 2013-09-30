gt.utils = {

  latLongToVector3: function  (lat, lon, radius) {
    var phi = (lon+90)*Math.PI/180;//lon
    var theta = lat*Math.PI/180;//lat
    //lat = lat + 90 makes sin(theta) --> cos(theta)
    var z = radius * Math.cos(phi) * Math.cos(theta);//lon
    var x = radius * Math.sin(phi) * Math.cos(theta);//lat
    var y = radius * Math.sin(theta);

    return new THREE.Vector3(x,y,z);

   },
   addPoints: function (data) {

    var particles = new THREE.Geometry();

    var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0x990000, size: 50, map: THREE.ImageUtils.loadTexture( "../../images/particle.png" ),blending: THREE.AdditiveBlending, transparent:true});
    for (var i = 0 ; i < data.length; i++) {
      var x = parseInt(data[i]['geo']['lat']);
      var y = parseInt(data[i]['geo']['lon']);
      var position = this.latLongToVector3( x, y, 200);
      var particle = new THREE.Vector3(position['x'], position['y'], position['z']);
      particles.vertices.push(particle); 

    }

    return new THREE.ParticleSystem(particles, particleMaterial);

  }
};