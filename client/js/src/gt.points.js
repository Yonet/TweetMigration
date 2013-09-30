//Creates particles
gt.Points = function (color, size texture) {
  this.particleGeometry = new THREE.Geometry();
  this.particleMaterial = new THREE.ParticleBasicMaterial({
  	color: color || 0x990000,
  	size: size || 50,
    map: THREE.ImageUtils.loadTexture( "../../images/particle.png" ),
    blending: THREE.AdditiveBlending,
    transparent:true
  });
};

gt.Points.prototype = {
	constructor: gt.Points,
	init: function (position) {
		this.particle = particle =new THREE.Vector3();
		this.position = position;
		this.age = 0;
		this.speed: 0.01+Math.random()*0.04;
		this.orbit = RADIUS*.5 + (RADIUS * .5 * Math.random());
	},
	onData: function(data){
		for ( var i = 0; i < data.length; i++ ) {
        	var x = parseInt(data[i]['geo']['lat']);
	        var y = parseInt(data[i]['geo']['lon']);
	        var position = gt.utils.latLongToVector3( x, y, 200);
	        this.init(position);
	}
};