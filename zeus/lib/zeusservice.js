var _ = require('underscore');

function ZeusService(type) {
	this.type = type || '';
	this.config = {};
}

/** Loads a true ZeusService object out of a plain JS object with matching properties */
ZeusService.revive = function(obj) {
	return new ZeusService(obj.type);
};
ZeusService.prototype.cryo = function() {
	var frozen = {
		type: this.type,
		config: {}
	};
	_.each(this.services, function(element, key, list) {
		frozen.config[key] = element.cryo();
	});
	return frozen;
};
exports = module.exports = ZeusService;