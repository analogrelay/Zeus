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
Environment.revive = function(obj) {
	return new Environment(
		obj.app, 
		obj.name,
		utils.mapObject(obj.services, ServiceInstance.revive),
		obj.config);
};

Environment.prototype.save = function(path, callback) {
	// Pretty-print the JSON
	var str = JSON.stringify(Environment.cryofreeze(this), null, 2);
	
	// Write it out
	log.verbose('writing Zeusspec: ' + path);
	fs.writeFile(path, str, callback);
};

/** Returns a copy of the object designed for cleaner JSON serialization */
Environment.cryofreeze = function(self) {
	return {
		app: self.app,
		name: self.name,
		services: utils.mapObject(self.services, ServiceInstance.cryofreeze),
		config: self.config
	};
};

module.exports = exports = Environment;