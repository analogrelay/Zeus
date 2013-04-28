var _ = require('underscore'),
	ZeusService = require('./zeusservice');

function Zeusfile(name) {
	this.name = name || '';
	this.services = {};
}

/** Loads a true Zeusfile object out of a plain JS object with matching properties */
Zeusfile.revive = function(obj) {
	var zf = new Zeusfile(obj.name);
	if(obj.services) {
		_.each(obj.services, function(value, key, list) {
			zf.services[key] = ZeusService.revive(value);
		});
	}
	return zf;
};

/** Returns a copy of the object designed for cleaner JSON serialization */
Zeusfile.prototype.cryo = function() {
	var frozen = {
		name: this.name,
		services: {}
	};
	_.each(this.services, function(element, key, list) {
		frozen.services[key] = element.cryo();
	});
	return frozen;
};

exports = module.exports = Zeusfile;