fs = require 'fs'
path = require 'path'
_ = require 'underscore'
winston = require 'winston'
async = require 'async'

UIService = require './ui'
Environment = require './environment'
cryo = require './utils/cryo'

ServiceTypeRegex = /([^\.]*)\.(.*)/

findPlugins = (services) ->
    return _.uniq _.filter _.map(services, (value, key, list) ->
        parseServiceType(value.type).plugin
    ), _.isString

parseServiceType = (serviceType) ->
    if m = serviceType.match(ServiceTypeRegex)
        plugin: m[1],
        name: m[2]
    else
        {}

module.exports = class Context
    constructor: (@zeusfile, @path, @ui = UIService.empty) ->
        @plugins = {}

    check: () ->
        issues = []
        for key in @zeusfile.services.keys()
            type = parseServiceType(@zeusfile.services.get(key).type);
            if not @plugins.hasOwnProperty type.plugin
                issues.push { type: 'missing_plugin', name: type.plugin, service: key }
        return issues

    createEnvironment: (name, callback) ->
        callback null, new Environment(@zeusfile.name, name)

    #     @collectGlobalConfiguration (err, config) =>
    #         async.mapSeries Object.keys(@zeusfile.services), (key, callback) =>
    #             service = @zeusfile.services[key]
    #             type = parseServiceType service.type
    #             if @plugins.hasOwnProperty type.plugin
    #                 @plugins[type.plugin].createServiceInstance @zeusfile, name, service, key, type.name, (err, instance) =>
    #                     if err
    #                         callback err
    #                     else
    #                         callback null, {
    #                             serviceName: key,
    #                             instance: instance
    #                         }
    #             else
    #                 callback()
    #         , (err, instances) =>
    #             if err
    #                 callback err
    #             else
    #                 services = {}
    #                 services[instance.serviceName] = instance.instance for instance in instances
    #                 env = new Environment(self.zf.name, name, services, config);
    #                 callback null, env

    # collectGlobalConfiguration: (callback) ->
    #     # Find the plugins for all services
    #     pluginNames = findPlugins @zeusfile.services
    #     config = {};
        
    #     self.ui.log.info 'collecting global configuration information...'
    #     async.eachSeries pluginNames, (pluginName, callback) =>
    #         if @plugins.hasOwnProperty pluginName
    #             @plugins[pluginName].collectGlobalConfiguration (err, pluginConfig) =>
    #                 if err
    #                     callback err
    #                 else
    #                     config[pluginName] = pluginConfig;
    #                     callback()
    #         else
    #             callback()
    #     , (err) =>
    #         callback err, config

    loadPlugins: (dir, callback) ->
        [callback, dir] = [dir, path.join __dirname, 'plugins'] if typeof dir is 'function'

        @ui.log.verbose 'scanning ' + dir + ' for plugins'
        fs.readdir dir, (err, files) =>
            if err
                callback err
            else
                @loadPlugin path.join(dir, file) for file in files when path.extname(file) is '.js'
                callback()

    save: (callback) ->
        # Check for issues
        issues = @check()
        if issues.length > 0
            for issue in issues when issue.type is 'missing_plugin'
                @ui.log.warn "plugin for '" + issue.name + "' could not be found"
                @ui.log.warn " you will not be able to work with the '" + issue.service + "' service" 
        
        # Pretty-print the JSON
        str = JSON.stringify cryo.freeze(@zeusfile), null, 2
        
        # Write it out
        @ui.log.verbose 'writing Zeusfile: ' + @path
        fs.writeFile @path, str, callback

    loadPlugin: (path) ->
        new (require path)(@, @ui)

    # provision: (env, serviceName, callback) ->
    #     # Find the plugin
    #     service = @zeusfile.services[serviceName];
    #     type = parseServiceType service.type

    #     if @plugins.hasOwnProperty type.plugin
    #         @plugins[type.plugin].provision @zeusfile, env, type.name, service, env.services[serviceName], callback
    #     else
    #         callback new Error "No plugin for '" + service.type + "'"