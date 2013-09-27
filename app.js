var express      = require('express');
var app          = express();
var server       = require('http').createServer(app);
var io           = require('socket.io').listen(server);
process.env.PORT = process.env.PORT || 8080;
var path         = require('path');
var url          = 'http://localhost:' + process.env.PORT + '/';

// listening to process.env.PORT...
server.listen(process.env.PORT);
console.log("Express server listening on port " + process.env.PORT);
console.log(url);