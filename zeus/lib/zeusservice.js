var ConfigSetting = require('./configsetting'),
	_ = require('./extensions/underscore');

function ZeusService(type, config) {
	this.type = type || '';
	this.config = config || {};
}

/** Loads a true ZeusService object out of a plain JS object with matching properties */
ZeusService.fromJSON = function(value) {
	return new ZeusService(
		value.type,
		_.mapObject(value.config || {}, ConfigSetting.fromJSON));
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ZeusService.toJSON = function(value) {
	return {
		type: value.type,
		config: _.mapObject(value.config || {}, ConfigSetting.toJSON)
	};
};

exports = module.exports = ZeusService;