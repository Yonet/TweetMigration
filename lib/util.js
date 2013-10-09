module.exports = {
	// Get the center of a bounding box
	getBoundingBoxCenter: function(coordList) {
		var total = coordList.length;

		var X = 0;
		var Y = 0;
		var Z = 0;

		coordList.forEach(function(i) {
			var lat = i[1] * Math.PI / 180;
			var lon = i[0] * Math.PI / 180;

			var x = Math.cos(lat) * Math.cos(lon);
			var y = Math.cos(lat) * Math.sin(lon);
			var z = Math.sin(lat);

			X += x;
			Y += y;
			Z += z;
		});

		X = X / total;
		Y = Y / total;
		Z = Z / total;

		var Lon = Math.atan2(Y, X);
		var Hyp = Math.sqrt(X * X + Y * Y);
		var Lat = Math.atan2(Z, Hyp);

		return [Lat * 180 / Math.PI, Lon * 180 / Math.PI];
	}
};
