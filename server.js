var express = require('express');
var path = require('path');

// Create app
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);

// Store the root path of the app
app.set('root', __dirname);

// Setup middleware and routes
require('./config/middleware.js')(app);
require('./config/routes.js')(app);

// Setup sockets
var socket = require('./config/sockets.js')(io);

// Start server
var port = process.env.port || 3000;
server.listen(port);
console.log('Server listening on port %d', port);
