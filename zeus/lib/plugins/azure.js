var Plugin = require('../plugin'),
	ServiceInstance = require('../serviceinstance.js');

function CloudServicePlugin(context) {
	Plugin.apply(this, [context]);
}
CloudServicePlugin.prototype.createInstance = function(environmentName, serviceName, service) {
	var serviceName = this.context.zf.name + '-' + serviceName + '-' + environmentName;
	return new ServiceInstance(serviceName);
};

exports.attach = function(context, log) {
	log.verbose('loading azure plugin');

	context.plugins['Azure.CloudService'] = new CloudServicePlugin(context);
};
module.exports = exports;