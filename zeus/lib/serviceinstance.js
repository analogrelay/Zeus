var _ = require('underscore');

function ServiceInstance(name) {
	this.name = name || '';
	this.config = {};
}

/** Loads a true Environment object out of a plain JS object with matching properties */
ServiceInstance.revive = function(obj) {
	var env = new ServiceInstance(obj.name);
	env.config = obj.config;
	return env;
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ServiceInstance.prototype.cryo = function() {
	var frozen = {};
	if(this.name) {
		frozen.name = this.name;
	}
	frozen.config = this.config;
	return frozen;
};

module.exports = exports = ServiceInstance;