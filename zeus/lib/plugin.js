function Plugin(context, cli, log) {
	this.context = context;
	this.cli = cli;
	this.log = log;
}
Plugin.prototype.createInstance = function(env, serviceName, service, callback) {
	throw new Error("plugin does not implement createInstance");
}

module.exports = exports = Plugin;