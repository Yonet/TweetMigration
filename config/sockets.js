var util = require('util');
var twitter = require('twitter');
var fs = require('fs');
var util = require('../lib/util.js');

module.exports = function(app, io) {
	var config = app.get('config');
	var twit = new twitter(config);

	var markerQueue = [];

	// Send tweets to connected clients a max of 1,000 times per second
	var sendDelay = 20;
	var maxBufferSize = 100;

	function sendMarker() {
		var marker = markerQueue.shift();

		if (marker) {
			if (config.debug)
				_console.log('<bg-green>'+marker.user+'</bg-green>: '+marker.tweet);

			// Send the marker
			controller.sendMarker(marker);

			var bufferSize = markerQueue.length;
			// Calcuate when to send next marker
			if (bufferSize > maxBufferSize*1.05) {
				sendDelay *= 0.999;
			}
			if (bufferSize < maxBufferSize*0.95) {
				sendDelay *= 1.001;
			}
		}

		// Queue next send
		setTimeout(sendMarker, sendDelay);
	};

	var started = false;

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

			markerQueue.push({
				user: data.user.screen_name,
				tweet: data.text,
				location: coordinates
			});

			if (!started && markerQueue.length >= maxBufferSize) {
				sendMarker();
				started = true;
			}
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


	