function ZeusService(type) {
	this.type = type || '';
}

/** Loads a true ZeusService object out of a plain JS object with matching properties */
ZeusService.revive = function(obj) {
	return new ZeusService(obj.type);
};
exports = module.exports = ZeusService;