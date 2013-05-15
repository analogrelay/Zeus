var Plugin = require('../plugin'),
    fs = require('fs'),
    path = require('path'),
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

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 502); // 0766
    }

    return dir;
}
// End

// Hacked up from azure-cli
function readSubscriptions (publishSettingsFilePath, callback) {
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
                    } catch (ex) {
                        // This looks like an xml parsing error, not PFX.
                        callback(ex);
                        publishSettings = null;
                    }

                    if (publishSettings) {
                        var subs = publishSettings.PublishData.PublishProfile[0].Subscription;
                        if (typeof subs === 'undefined' || subs === undefined) {
                            subs = [];
                        } else if (typeof (subs[0]) === 'undefined') {
                            subs = [subs];
                        }

                        var subscriptions = [];
                        for (var s in subs) {
                            subscriptions[s] = subs[s].$;
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

function getSubscriptions(callback) {
    var azureDirectory = azureDir();
    var pemPath = path.join(azureDirectory, 'managementCertificate.pem');
    var publishSettingsFilePath = path.join(azureDirectory, 'publishSettings.xml');
    
    // Read the subscriptions from the Publish Settings file
    fs.exists(publishSettingsFilePath, function(exists) {
        if(!exists) {
            callback(new Error("Publish Settings file not found."));
        } else {
            readSubscriptions(publishSettingsFilePath, function(err, subscriptions) {
                callback(null, subscriptions);
            });
        }
    });
}

function createServiceManagementService(subscriptionId) {
    throw new Error("not implemented.");
}

function WebsiteServiceType(plugin) {
    this.plugin = plugin;
    this.context = plugin.context;
    this.ui = plugin.ui;
}

WebsiteServiceType.prototype.createInstance = function(zeusfile, environmentName, service, serviceName, callback) {
    // Set the name
    var name = zeusfile.name + '-' + environmentName + '-' + serviceName;

    // All we need to do now is return a service instance object
    callback(null, new ServiceInstance({
        name: name
    }));
};

WebsiteServiceType.prototype.provision = function(zeusfile, env, service, instance, callback) {
    this.ui.log.info("provisioning azure website: " + instance.config.name);
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
    getSubscriptions(function(err, subscriptions) {
        if(err) {
            callback(err);
        } else {
            self.ui.cli.choose(_.pluck(subscriptions, 'Name'), function(i) {
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