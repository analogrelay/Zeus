var Plugin = require('../plugin'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    ServiceInstance = require('../serviceinstance'),
    scripty = require('azure-scripty'),
    async = require('async');

function WebsiteServiceType(plugin) {
    this.plugin = plugin;
    this.context = plugin.context;
    this.ui = plugin.ui;
}

WebsiteServiceType.prototype.createInstance = function(zeusfile, environmentName, service, serviceName, callback) {
    // Set the name
    var self = this;
    var name = zeusfile.name + '-' + environmentName + '-' + serviceName;

    // Get the list of available location
    self.ui.log.info("configuring website: '" + name + "'");
    self.ui.log.info("enumerating locations...");
    async.waterfall([
        function(callback) {
            scripty.invoke({
                command: 'site location list'
            }, function(err, locations) {
                if(err) {
                    callback(err);
                } else if(locations.length == 0) {
                    callback(new Error("You must create at least one website through the portal to use this. You can remove it after it is created."));
                } else if(locations.length == 1) {
                    callback(null, instance.config.location);
                } else {
                    self.ui.log.help("Choose a location for the '" + name + "' website");
                    self.ui.cli.choose(_.pluck(locations, 'Name'), function(i) {
                        callback(null, locations[i].Name);
                    });
                }
            });
        }, function(location, callback) {
            callback(null, new ServiceInstance({
                name: name,
                location: location
            }));
        }
    ], callback);
};

WebsiteServiceType.prototype.provision = function(zeusfile, env, service, instance, callback) {
    var self = this;
    var subscription = env.config.azure.subscription;
    self.ui.log.info("provisioning azure website: " + instance.config.name);
    self.ui.log.info(" in subscription: " + subscription.name);

    // Check if the site exists already
    async.waterfall([
        function(callback) {
            self.ui.log.info("checking if site already exists...");
            scripty.invoke({
                command: 'site show',
                positional: [instance.config.name],
                subscription: subscription.id
            }, function(err) {
                if(!err) {
                    callback(new Error("Website already exists: " + instance.config.name));
                } else {
                    callback(null);    
                }
            });
        }, function(callback) {
            self.ui.log.info("creating site in '" + instance.config.location + "' region");
            scripty.invoke({
                command: 'site create',
                positional: [instance.config.name],
                location: '"' + instance.config.location + '"',
                subscription: subscription.id
            }, callback);
        }
    ], function(err, results) {
        if(err) {
            callback(err);
        } else {
            self.ui.log.info("successfully provisioned '" + instance.config.name + "'");
            callback(null, results);
        }
    });
};

function AzurePlugin(context, ui) {
    Plugin.apply(this, [context, ui]);
    this.serviceTypes.website = new WebsiteServiceType(this);
}
exports.AzurePlugin = AzurePlugin;

AzurePlugin.prototype = new Plugin();
AzurePlugin.prototype.collectGlobalConfiguration = function(callback) {
    var self = this;

    // Ask the user which subscription they want
    scripty.invoke({
        command: 'account list'
    }, function(err, subscriptions) {
        if(err) {
            callback(err);
        } else {
            self.ui.log.help("choose a subscription")
            self.ui.cli.choose(_.pluck(subscriptions, 'Name'), function(i) {
                var sub = subscriptions[i];

                callback(null, {
                    subscription: {
                        name: subscriptions[i].Name,
                        id: subscriptions[i].Id
                    }
                });
            });
        }
    });
};

exports.attach = function(context, ui) {
    ui.log.verbose('loading azure plugin');

    context.plugins.azure = new AzurePlugin(context, ui);
};
module.exports = exports;