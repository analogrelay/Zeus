var Plugin = require('../plugin'),
	scripty = require('azure-scripty'),
	_ = require('underscore'),
	ServiceInstance = require('../serviceinstance.js');

function CloudServicePlugin(context, cli, log) {
	Plugin.apply(this, [context, cli, log]);
}
CloudServicePlugin.prototype.createInstance = function(env, serviceName, service, callback) {
	var self = this;
	var instanceName = self.context.zf.name + '-' + serviceName + '-' + env.name;

	function continuation(err, subscriptionId) {
		if(err) {
			callback(err);
		}
		else {
			callback(null, new ServiceInstance(instanceName))
		}
	}

	if(env.config.subscriptionId) {
		continuation(null, env.config.subscriptionId);
	} else {
		// Get a list of available subscriptions
		scripty.invoke('account list', function(err, accounts) {
			if(err) {
				continuation(new Error("No Azure Accounts have been registered, run 'azure account list' for more info"));
			} else {
				var names = _.pluck(accounts, "Name");

				self.log.info("Choose a Subscription to use for this application: ")
				self.cli.choose(names, function(i) {
					self.log.info("Using '" + names[i] + "'.");
					env.config.subscriptionId = accounts[i].Id;
					continuation(null, env.config.subscriptionId);
				});
			}
		});
	}
};

exports.attach = function(context, cli, log) {
	log.verbose('loading azure plugin');

	context.plugins['Azure.CloudService'] = new CloudServicePlugin(context, cli, log);
};
module.exports = exports;