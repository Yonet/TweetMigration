var http = require('http');
//var socketio = require('socket.io');
var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var util = require('./lib/util.js');
require('./lib/_console.js');

// Create app
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Store the root path of the app
app.set('root', __dirname);

// Store configuration
var defaults = {
	debug: true
};

// Include configuration, combine with defaults
if (!fs.existsSync('./config.json'))
	throw(new Error('You must supply a config.json file in the root of the project'));

var config = _.extend(require('./config.default.json'), require('./config.json'));
app.set('config', config);

// Setup middleware and routes
require('./config/middleware.js')(app);
require('./config/routes.js')(app);

// Setup sockets
var socket = require('./config/sockets.js')(app, io);

// Start server
var port = process.env.PORT || config.port;
server.listen(port);
_console.log('Server listening on port <b>%d</b>', port);
