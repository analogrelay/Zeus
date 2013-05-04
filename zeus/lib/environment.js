var _ = require('underscore'),
	fs = require('fs'),
	log = require('winston'),
	ServiceInstance = require('./serviceinstance');

function Environment(app, name) {
	this.app = app || '';
	this.name = name || '';

	this.services = {};
	this.config = {};
}

/** Loads a true Environment object out of a plain JS object with matching properties */
Environment.revive = function(obj) {
	var env = new Environment(obj.app, obj.name);
	if(obj.services) {
		_.each(obj.services, function(value, key, list) {
			env.services[key] = ServiceInstance.revive(value);
		});
	}
	env.config = obj.config;
	return env;
};

Environment.prototype.save = function(path, callback) {
	// Pretty-print the JSON
	var str = JSON.stringify(this.cryo(), null, 2);
	
	// Write it out
	log.verbose('writing Zeusspec: ' + path);
	fs.writeFile(path, str, callback);
};

/** Returns a copy of the object designed for cleaner JSON serialization */
Environment.prototype.cryo = function() {
	var frozen = {
		app: this.app,
		name: this.name,
		services: {},
		config: this.config
	};
	_.each(this.services, function(element, key, list) {
		frozen.services[key] = element.cryo();
	});
	return frozen;
};

module.exports = exports = Environment;