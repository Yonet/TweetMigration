var shellColor = require('shellcolor');

var logColor = function(type) {
	args = Array.prototype.slice.call(arguments, 1);
	args.forEach(function(arg, index) {
		if (typeof arg === 'string') {
			args[index] = shellColor(arg)
		}
	});

	console[type].apply(_console, args);
};

var _console = {
	log: logColor.bind(_console, 'log'),
	error: logColor.bind(_console, 'error'),
	warn: logColor.bind(_console, 'warn'),
	assert: function(exp, obj) {
		obj = typeof obj === 'string' ? shellColor(obj) : obj;
		console.assert(exp, obj);
	}
};

global._console = _console;
