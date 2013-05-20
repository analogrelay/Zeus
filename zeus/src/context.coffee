fs = require 'fs'
path = require 'path'
_ = require 'lodash'
winston = require 'winston'
async = require 'async'

UIService = require './ui'
Environment = require './environment'
cryo = require './utils/cryo'

ServiceTypeRegex = /([^\.]*)\.(.*)/

findPlugins = (services) ->
    return _(services)
        .map((value, key, list) ->
            parseServiceType(value.type).plugin
        )
        .filter(_.isString)
        .uniq()

parseServiceType = (serviceType) ->
    if m = serviceType.match(ServiceTypeRegex)
        plugin: m[1],
        name: m[2]
    else
        plugin: serviceType,
        name: ''

missingPluginError = (plugin, service) -> 
    type: 'missing_plugin', 
    name: plugin, 
    service: service

module.exports = class Context
    constructor: (@zeusfile, @path, @ui = UIService.empty) ->
        @plugins = {}

    check: () ->
        issues = null
        for service in @zeusfile.services.values()
            type = parseServiceType service.type
            if not @plugins.hasOwnProperty type.plugin
                issue = missingPluginError type.plugin, service.name
                if not issues?
                    issues = [issue]
                else
                    issues.push issue
        return issues

    createEnvironment: (name, callback) ->
        # Create the environment object
        env = new Environment @zeusfile.name, name

        # Check for errors
        errors = @check() || []

        # Instantiate services
        async.mapSeries @zeusfile.services.values(), ((service, callback) =>
            type = parseServiceType service.type
            if not @plugins.hasOwnProperty type.plugin
                callback()
            else if not @plugins[type.plugin].hasOwnProperty 'createServiceInstance'
                errors.push new Error "'#{type.plugin}' plugin does not implement createServiceInstance!"
                callback()
            else 
                @plugins[type.plugin].createServiceInstance @zeusfile, service, env, (err, instance) ->
                    if err?
                        errors.push err
                    else
                        env.instances.add instance
                    callback()
        ),((err) =>
            if err?
                # Fatal error, rather than an error due to missing or failed plugin execution
                callback err
            else
                # Return the environment
                # Error parameter needs to be null if there are no errors, so coalesce to that.
                callback (if errors.length > 0 then errors else null), env
        )

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
        if issues?
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