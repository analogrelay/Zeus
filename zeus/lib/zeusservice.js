var utils = require('./utils'),
	ConfigSetting = require('./configsetting');

function ZeusService(type, config) {
	this.type = type || '';
	this.config = config || {};
}

/** Loads a true ZeusService object out of a plain JS object with matching properties */
ZeusService.revive = function(obj) {
	return new ZeusService(
		obj.type,
		utils.mapObject(obj.config, ConfigSetting.revive));
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ZeusService.prototype.cryofreeze = function() {
	return {
		type: this.type,
		
		// the value is the default context, so using the prototype method works!
		config: utils.mapObject(this.config, ConfigSetting.prototype.cryofreeze)
	};
};
exports = module.exports = ZeusService;