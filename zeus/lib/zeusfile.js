var utils = require('./utils'),
	ZeusService = require('./zeusservice');

function Zeusfile(name, services) {
	this.name = name || '';
	this.services = services || {};
}

/** Loads a true Zeusfile object out of a plain JS object with matching properties */
Zeusfile.revive = function(obj) {
	return new Zeusfile(
		obj.name, 
		utils.mapObject(obj.services, ZeusService.revive));
};

/** Returns a copy of the object designed for cleaner JSON serialization */
Zeusfile.prototype.cryofreeze = function() {
	return {
		name: this.name,

		// the value is the default context, so using the prototype method works!
		services: utils.mapObject(this.services, ZeusService.prototype.cryofreeze)
	};
};

exports = module.exports = Zeusfile;