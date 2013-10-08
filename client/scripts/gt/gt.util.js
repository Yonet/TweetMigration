gt.util = {
	// Convert a latitude/longitude pair to a 3D point
	latLongToVector3: function(lat, lon, radius) {
		var phi = (lon+90)*Math.PI/180; // Lon
		var theta = lat*Math.PI/180; // Lat

		var z = radius * Math.cos(phi) * Math.cos(theta); // Lon
		var x = radius * Math.sin(phi) * Math.cos(theta); // Lat
		var y = radius * Math.sin(theta);

		return new THREE.Vector3(x,y,z);
	},

	// Convert a latitude/longitude pair to a X/Y coordiante pair
	// Via http://stackoverflow.com/a/14457180/1170723
	latLongTo2dCoordinate: function(latitude, longitude, mapWidth, mapHeight) {
		var pos = {};

		// Get X value
		pos.x = (mapWidth*(longitude)/360)%mapWidth+(mapWidth/2);

		// Convert from degrees to radians
		var latRad = gt.util.deg2rad(latitude);

		// Get Y value
		var mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2))) * Math.cos(latRad/Math.PI*2); // Close enough

		pos.y = (mapHeight/2)-(mapWidth*mercN/(2*Math.PI));

		if (isNaN(pos.y) || isNaN(pos.x)) {
			throw new Error('Failed to calculate position for '+latitude+','+longitude);
		}

		return pos;
	},

	rad2deg: function(rad) {
		return rad * 180 / Math.PI;
	},

	deg2rad: function(deg) {
		return deg * Math.PI / 180;
	},

	extend: function() {
		var objs = arguments;
		var result = objs[0];
		for (var i = 1; i < objs.length; i++) {
			var obj = objs[i];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop))
					result[prop] = obj[prop];
			}
		}
		return result;
	}
};