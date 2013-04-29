var Plugin = require('../plugin'),
	scripty = require('azure-scripty'),
	_ = require('underscore'),
	ServiceInstance = require('../serviceinstance.js');

function CloudServicePlugin(context, cli, log) {
	Plugin.apply(this, [context, cli, log]);
}

CloudServicePlugin.prototype.createServiceInstance = function(env, serviceName, service, callback) {
	var self = this;
	var instanceName = self.context.zf.name + '-' + serviceName + '-' + env.name;

	function afterGetLocation(err) {
		if(err) {
			callback(err);
		}
		else {
			callback(null, new ServiceInstance(instanceName))
		}
	}

	function afterGetSubscription(err) {
		if(err) {
			callback(err);
		}
		else {
			scripty.invoke('account affinity-group list', function(err, affinityGroups) {
				if(err) {
					continuation(new Error("you have no affinity groups, create some in the portal first"));
				} else {
					var names = _.map(affinityGroups, function(item) {
						return item.Name + ' (' + item.Location + ')';
					});

					self.log.info("Choose an Affinity Group to use for this application: ")
					self.cli.choose(names, function(i) {
						self.log.info("Using '" + names[i] + "'.");
						env.config.affinityGroup = affinityGroups[i].Name;
						afterGetLocation(null);
					});
				}
			});
		}
	}

	if(env.config.subscriptionId) {
		afterGetSubscription(null);
	} else {
		// Get a list of available subscriptions
		scripty.invoke('account list', function(err, accounts) {
			if(err) {
				callback(new Error("no Azure accounts have been registered, run 'azure account list' for more info"));
			} else {
				var names = _.pluck(accounts, "Name");

				self.log.info("Choose a Subscription to use for this application: ")
				self.cli.choose(names, function(i) {
					self.log.info("Using '" + names[i] + "'.");
					env.config.subscriptionId = accounts[i].Id;
					afterGetSubscription(null);
				});
			}
		});
	}
};

CloudServicePlugin.prototype.provision = function(env, context, serviceName, callback) {

};

exports.attach = function(context, cli, log) {
	log.verbose('loading azure plugin');

	context.plugins['Azure.CloudService'] = new CloudServicePlugin(context, cli, log);
};
module.exports = exports;