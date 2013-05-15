var _ = require('underscore');

function ServiceInstance(name, config) {
	this.name = name || '';
	this.config = config || {};
}

/** Loads a true Environment object out of a plain JS object with matching properties */
ServiceInstance.revive = function(obj) {
	return new ServiceInstance(obj.name, obj.config);
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ServiceInstance.cryofreeze = function(self) {
	return {
		name: self.name,
		config: self.config
	};
};

module.exports = exports = ServiceInstance;