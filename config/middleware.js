var express = require('express');
var path = require('path');

module.exports = function(app) {
	app.use(express.static(path.join(app.get('root'), '/client')));
};
