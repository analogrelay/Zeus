function Plugin(context, ui) {
	this.context = context;
	this.ui = ui;

	this.serviceTypes = {};
}

Plugin.prototype.collectGlobalConfiguration = function(callback) {
	// Nothing to do by default
};

Plugin.prototype.createServiceInstance = function(zeusfile, environmentName, service, serviceName, type, callback) {
	if(this.serviceTypes.hasOwnProperty(type)) {
		this.serviceTypes[type].createInstance(zeusfile, environmentName, service, serviceName, callback);
	} else {
		callback(new Error("No handler for service type '" + type + "' registered."));
	}
};

Plugin.prototype.provision = function(zeusfile, env, type, service, instance, callback) {
	if(this.serviceTypes.hasOwnProperty(type)) {
		this.serviceTypes[type].provision(zeusfile, env, service, instance, callback);
	} else {
		callback(new Error("No handler for service type '" + type + "' registered."));
	}
};

module.exports = exports = Plugin;