var utils = require('./utils'),
	keyFiles = require('./keyFiles'),
	path = require('path'),
	log = require('winston'),
    xml2js = require('xml2js'),
	fs = require('fs');

exports.managementCertificate = function () {
    var pemFile = path.join(utils.azureDir(), 'managementCertificate.pem');
    log.silly('Reading pem', pemFile);
    return keyFiles.readFromFile(pemFile);
};

exports.managementEndpointUrl = function () {
  return process.env.AZURE_MANAGEMENTENDPOINT_URL ||
    'https://management.core.windows.net';
};

// Hacked up from azure-cli
exports.getSubscriptions = function(callback) {
    var azureDirectory = utils.azureDir();
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