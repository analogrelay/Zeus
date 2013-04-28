var _ = require('underscore'),
	ConfigSetting = require('./configsetting');

function ZeusService(type) {
	this.type = type || '';
	this.config = {};
}

/** Loads a true ZeusService object out of a plain JS object with matching properties */
ZeusService.revive = function(obj) {
	var service = new ZeusService(obj.type);
	if(obj.config) {
		_.each(obj.config, function(value, key, list) {
			service.config[key] = ConfigSetting.revive(value);
		});
	}
	return service;
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ZeusService.prototype.cryo = function() {
	var frozen = {
		type: this.type,
		config: {}
	};
	_.each(this.config, function(element, key, list) {
		frozen.config[key] = element.cryo();
	});
	return frozen;
};
exports = module.exports = ZeusService;