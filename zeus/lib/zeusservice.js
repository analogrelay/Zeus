function ZeusService(name, type) {
	this.name = name || '';
	this.type = type || '';
	this.config = {};
}

/** Loads a true ZeusService object out of a plain JS object with matching properties */
ZeusService.revive = function(name, obj) {
	return new ZeusService(name, obj.type);
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