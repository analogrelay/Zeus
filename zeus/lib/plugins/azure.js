var Plugin = require('../plugin'),
    WebsiteServiceType = require('./azure/website'),
    _ = require('underscore'),
    scripty = require('azure-scripty');

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