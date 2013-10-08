var util = require('util');
var twitter = require('twitter');
var fs = require('fs');
var _ = require('underscore');

// Get the center of a bounding box
var getCenter = function(coordList) {
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

var twit = new twitter({
	consumer_key: 'fsq4YbjfXuQWJRs01XatGQ',
	consumer_secret: 'lzXoLOGzxGYeItJ327BGSLcNmZcmPft62x0tHuZYmac',
	access_token_key: '35870660-0250Io0UYm5NHG6QgM7bq7h9aChvA30FIBYV0j1ql',
	access_token_secret: 'RFabG3sgMgg9DlwoWRZrQRIizQZultYvo2Ek9C0Xo'
});

module.exports = function(io) {
	twit.stream('filter', {
		// track: 'oow13',
		locations: '-180,-90,180,90'
	}, function(stream) {
		stream.on('data', function(data) {
			var coordinates = null;

			if (data.coordinates) {
				coordinates = data.coordinates.coordinates.reverse();
			}
			else if (data.place) {
				coordinates = getCenter(data.place.bounding_box.coordinates[0]);
			}
			else if (data.limit) {
				// Twitter sends this every second or so
				return;
			}
			else {
				console.error('Got tweet without location data', data);
				return;
			}

			interface.sendMarker({
				user: data.user.screen_name,
				tweet: data.text,
				location: coordinates
			});
		});
	});

	io.sockets.on('connection', function(socket) {
		console.log('Accepted client from %s', socket.handshake.address.address);
	});

	// Define a socket interface
	var interface = {};

	interface.sendMarker = function( markerData) {
		io.sockets.emit('marker', markerData);
	};

	return interface;
};


	