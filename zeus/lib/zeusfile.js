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

exports = module.exports = Zeusfile;