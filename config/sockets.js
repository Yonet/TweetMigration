var util = require('util');
var twitter = require('twitter');
var fs = require('fs');
var util = require('../lib/util.js');

module.exports = function(app, io) {
	var config = app.get('config');
	var twit = new twitter(config);

	// Stream tweets from Twitter
	twit.stream('filter', {
		locations: '-180,-90,180,90',

	}, function(stream) {
		stream.on('data', function(data) {
			var coordinates = null;

			if (data.coordinates) {
				coordinates = data.coordinates.coordinates.reverse();
			}
			else if (data.place) {
				coordinates = util.getBoundingBoxCenter(data.place.bounding_box.coordinates[0]);
			}
			else if (data.limit) {
				// Twitter sends this every second or so
				return;
			}
			else {
				console.error('Got tweet without location data', data);
				return;
			}

			if (config.debug)
				_console.log('<bg-green>'+data.user.screen_name+'</bg-green>: '+data.text);

			controller.sendMarker({
				user: data.user.screen_name,
				tweet: data.text,
				location: coordinates
			});
		});
	});

	// Accept socket connections
	io.sockets.on('connection', function(socket) {
		_console.log('Accepted client from <b>%s</b>', socket.handshake.address.address);
	});

	// Define a socket controller
	var controller = {};

	controller.sendMarker = function( markerData) {
		io.sockets.emit('marker', markerData);
	};

	return controller;
};


	