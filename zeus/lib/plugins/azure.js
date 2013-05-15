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

function getSubscriptions(callback) {
    var azureDirectory = utils.azureDir();
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

function AzurePlugin(context, ui) {
    this.context = context;
    this.ui = ui;
}
exports.AzurePlugin = AzurePlugin;

AzurePlugin.prototype.collectGlobalConfiguration = function(callback) {
    // Ask the user which subscription they want
    getSubscriptions(function(err, subscriptions) {
        if(err) throw err;
        this.ui.choose(subscriptions, function(i) {
            this.log.info('Selected: ' + subscriptions[i]);
        });
    });
};

exports.attach = function(context, ui) {
    ui.log.verbose('loading azure plugin');

    context.plugins['Azure'] = new AzurePlugin(context, ui);
};
module.exports = exports;