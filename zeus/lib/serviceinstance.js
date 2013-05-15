var _ = require('underscore');

function ServiceInstance(config) {
	this.config = config || {};
}

/** Loads a true Environment object out of a plain JS object with matching properties */
ServiceInstance.revive = function(obj) {
	return new ServiceInstance(obj.config);
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ServiceInstance.cryofreeze = function(self) {
	return {
		config: self.config
	};
};

module.exports = exports = ServiceInstance;