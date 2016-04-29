var util = require('util');
var Twit = require('twit');
var fs = require('fs');
var util = require('../lib/util.js');

module.exports = function (app, io) {
    console.log('socket runnning ');
    var config = app.get('config');
    var twit = new Twit(config);

    var markerQueue = [];

    // Send one tweet every sendDelay milliseconds
    var sendDelay = 20;

    // Adjust sendDelay to maintain a buffer of maxBufferSize
    var maxBufferSize = 100;

    function sendMarker() {
        var marker = markerQueue.shift();
        if (marker) {
            if (config.debug)
                _console.log('<bg-green>' + marker.user + '</bg-green>: ' + marker.tweet);

            // Send the marker
            controller.sendMarker(marker);

            var bufferSize = markerQueue.length;

            // Calcuate when to send next marker
            if (bufferSize > maxBufferSize * 1.05) {
                sendDelay *= 0.999;
            }
            if (bufferSize < maxBufferSize * 0.95) {
                sendDelay *= 1.001;
            }
        }

        // Queue next send
        setTimeout(sendMarker, sendDelay);
    };

    var started = false;

    // Stream tweets from Twitter args path, param, callback
    var stream = twit.stream('statuses/filter', {locations: ['-180,-90','180,90']}) // Match any tweet with coordinates
    stream.on('tweet', function (data) {
        //console.log('data', data);
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

        // Add the tweet to the queue
        markerQueue.push({
            user: data.user.screen_name,
            tweet: data.text,
            location: coordinates
        });

        // Start streaming to the client if the buffer is full
        if (!started && markerQueue.length >= maxBufferSize) {
            sendMarker();
            started = true;
        }
    });//Stream.on

    // Accept socket connections
    io.sockets.on('connection', function (socket) {
        _console.log('Accepted client from <b>%s</b>', socket.handshake.address.address);
    });

    // Define a socket controller
    var controller = {};

    // Send marker data to the client
    controller.sendMarker = function (markerData) {
        io.sockets.emit('marker', markerData);
    };

    return controller;
};
