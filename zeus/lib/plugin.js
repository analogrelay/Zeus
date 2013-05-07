function Plugin(context, cli, log) {
	this.context = context;
	this.cli = cli;
	this.log = log;
}

Plugin.prototype.createServiceInstance = function(env, serviceName, service, callback) {
	throw new Error("plugin does not implement createInstance");
};

Plugin.prototype.provision = function(env, context, serviceName, callback) {
	throw new Error("plugin does not implement provision");
};

module.exports = exports = Plugin;