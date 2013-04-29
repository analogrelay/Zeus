function Plugin(context) {
	this.context = context;
}
Plugin.prototype.createInstance = function(environmentName, serviceName, service) {
	throw new Error("plugin does not implement createInstance");
}

module.exports = exports = Plugin;