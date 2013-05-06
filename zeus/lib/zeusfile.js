var ZeusService = require('./zeusservice'),
	_ = require('./extensions/underscore');

function Zeusfile(name, services) {
	this.name = name || '';
	this.services = services || {};
}

/** Loads a true Zeusfile object out of a plain JS object with matching properties */
Zeusfile.fromJSON = function(value) {
	return new Zeusfile(
		value.name, 
		_.mapObject(value.services || {}, ZeusService.fromJSON));
};

/** Returns a copy of the object designed for cleaner JSON serialization */
Zeusfile.toJSON = function(value) {
	return {
		name: value.name,
		services: _.mapObject(value.services || {}, ZeusService.toJSON)
	};
};

exports = module.exports = Zeusfile;