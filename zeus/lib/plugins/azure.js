var Plugin = require('../plugin'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    ServiceInstance = require('../serviceinstance'),
    Channel = require('./azure/channel'),
    utils = require('./azure/utils'),
    account = require('./azure/account');

// azure-cli uses a fixed list for this, so I guess we will too?
var webspaces = [
      { GeoRegion: 'North Europe', WebSpace: 'northeuropewebspace' },
      { GeoRegion: 'West Europe', WebSpace: 'westeuropewebspace' },
      { GeoRegion: 'East US', WebSpace: 'eastuswebspace' },
      { GeoRegion: 'North Central US', WebSpace: 'northcentraluswebspace' },
      { GeoRegion: 'West US', WebSpace: 'westuswebspace' },
      { GeoRegion: 'East Asia', WebSpace: 'eastasiawebspace' }
];

function WebsiteServiceType(plugin) {
    this.plugin = plugin;
    this.context = plugin.context;
    this.ui = plugin.ui;
}

WebsiteServiceType.prototype.createInstance = function(zeusfile, environmentName, service, serviceName, callback) {
    // Set the name
    var name = zeusfile.name + '-' + environmentName + '-' + serviceName;

    // Ask the user which location they want to use
    if()
    self.log.info("Please choose the location in which to put the site")
    self.ui.cli.choose(_.pluck(webspaces, 'GeoRegion'), function(i) {
        var webspace = webspaces[i];

        // All we need to do now is return a service instance object
        callback(null, new ServiceInstance({
            name: name
            webspace: webspace.WebSpace
        }));
    });
};

WebsiteServiceType.prototype.provision = function(zeusfile, env, service, instance, callback) {
    this.ui.log.info("provisioning azure website: " + instance.config.name);

    // Open channel
    var channel = Channel.open();

    

    callback();
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
    account.getSubscriptions(function(err, subscriptions) {
        if(err) {
            callback(err);
        } else {
            self.log.info("Please Choose the subscription to use")
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