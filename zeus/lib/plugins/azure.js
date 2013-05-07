var Plugin = require('../plugin'),
	azure = require('azure'),
	xml2js = require('xml2js'),
	_ = require('underscore'),
	ServiceInstance = require('../serviceinstance.js');

// From azure-cli - We want to share the same data.
function homeFolder() {
	if (process.env.HOME !== undefined) {
		return process.env.HOME;
	}

	if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
		return process.env.HOMEDRIVE + process.env.HOMEPATH;
	}

	throw new Error('No HOME path available');
}

function azureDir() {
	var dir = process.env.AZURE_CONFIG_DIR ||
		path.join(homeFolder(), '.azure');

	if (!exports.pathExistsSync(dir)) {
		fs.mkdirSync(dir, 502); // 0766
	}

	return dir;
};
// End

// Hacked up from azure-cli
function readSubscriptions (callback) {
	fs.exists(publishSettingsFilePath, function(exists) {
		if(!exists) {
			callback(new Error('No publish settings file found. Please use the "azure account import" command via the azure-cli first.'));
		} else {
			var parser = new xml2js.Parser();
			fs.readFile(publishSettingsFilePath, function(err, readBuffer) {
				if(err) {
					callback(err);
				} else {
					var publishSettings = null;
					parser.on('end', function (settings) { publishSettings = settings; });
					try {
				  		parser.parseString(readBuffer);
					} catch (err) {
					    // This looks like an xml parsing error, not PFX.
					    callback(err);
				  		publishSettings = null;
					}

					if (publishSettings) {
				  		var subs = publishSettings.PublishProfile.Subscription;
				  		if (typeof subs === 'undefined' || subs === undefined) {
							subs = [];
						} else if (typeof (subs[0]) === 'undefined') {
							subs = [subs];
						}

						var subscriptions = [];
						for (var s in subs) {
					  		subscriptions[s] = subs[s]['@'];
						}
						callback(null, subscriptions);
					} else {
					 	callback(new Error('Invalid publish settings file.'));
					}
				}
			});
		}
	});
}

function getSubscriptions() {
	var azureDirectory = utils.azureDir();
 	var pemPath = path.join(azureDirectory, 'managementCertificate.pem');
 	var publishSettingsFilePath = path.join(azureDirectory, 'publishSettings.xml');
 	
 	// Read the subscriptions from the Publish Settings file
}

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
			callback(null, new ServiceInstance(instanceName));
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

					self.log.info("Choose an Affinity Group to use for this application: ");
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

				self.log.info("Choose a Subscription to use for this application: ");
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