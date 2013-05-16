var _ = require('underscore'),
	utils = require('./utils'),
	fs = require('fs'),
	log = require('winston'),
	ServiceInstance = require('./serviceinstance');

function Environment(app, name, services, config) {
	this.app = app || '';
	this.name = name || '';

	this.services = services || {};
	this.config = config || {};
}

/** Loads a true Environment object out of a plain JS object with matching properties */
Environment.revive = function(path, obj) {
	if(typeof path === 'object') {
		obj = path;
		path = null;
	}

	var env = new Environment(
		obj.app, 
		obj.name,
		utils.mapObject(obj.services, ServiceInstance.revive),
		obj.config);

	if(path) {
		env.path = path;
	}
	return env;
};

Environment.cryofreeze = function(self) {
	return {
		app: self.app,
		name: self.name,
		services: utils.mapObject(self.services, ServiceInstance.cryofreeze),
		config: self.config
	};
};

Environment.load = function(path, callback) {
	// Read the file
	fs.readFile(path, function(err, data) {
		if(err) {
			callback(err);
		} else {
			callback(null, Environment.revive(path, JSON.parse(data)));
		}
	});
}

Environment.prototype.save = function(path, callback) {
	if(typeof path === 'function') {
		callback = path;
		path = this.path;
	}
	// Pretty-print the JSON
	var str = JSON.stringify(Environment.cryofreeze(this), null, 2);
	
	// Write it out
	log.verbose('writing Zeusspec: ' + path);
	fs.writeFile(path, str, callback);
};

module.exports = exports = Environment;