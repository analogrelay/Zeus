_ = require 'underscore'
scripty = require 'azure-scripty'

Plugin = require '../../plugin'

#WebsiteServiceType = require('./azure/website'),

module.exports = class AzurePlugin extends Plugin
    constructor: (context, ui) ->
        super(context, ui);
        @ui.log.verbose('loading azure plugin');
        #@serviceTypes.website = 

    collectGlobalConfiguration: (callback) ->
        scripty.invoke 'account list', (err, subscriptions) ->
            if err
                callback err
            else
                @ui.log.help "choose a subscription"
                @ui.cli.choose (s.Name for s in subscriptions), (i) ->
                    callback null,
                        subscription:
                            name: subscriptions[i].Name,
                            id: subscriptions[i].Id