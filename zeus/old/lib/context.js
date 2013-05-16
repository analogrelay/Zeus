var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    winston = require('winston'),
    async = require('async'),
    UIService = require('./ui'),
    Environment = require('./Environment');

var ServiceTypeRegex = /([^\.]*)\.(.*)/;

function findPlugins(services) {
    return _.uniq(_.filter(_.map(services, function(value, key, list) {
        return parseServiceType(value.type).plugin;
    }), _.isString));
}

function parseServiceType(serviceType) {
    var m = serviceType.match(ServiceTypeRegex);
    if(m) {
        return {
            plugin: m[1],
            name: m[2]
        };
    } else {
        return {};
    }
}

function Context(zf, zfpath, ui) {
    this.zf = zf;
    this.path = zfpath;
    this.ui = ui || UIService.empty;
    
    this.plugins = {};

    /** Check this context for any issues relating to missing plugins */
    this.check = function() {
        var self = this;
        var issues = [];
        _.each(self.zf.services, function(service, name, list) {
            var type = parseServiceType(service.type)
            if(!(type.plugin in self.plugins)) {
                issues.push({ type: 'missing_plugin', name: type.plugin, service: name });
            }
        });
        return issues;
    };

    this.provision = function(env, serviceName, callback) {
        var self = this;

        // Find the plugin
        var service = self.zf.services[serviceName];
        var instance = env.services[serviceName];
        var type = parseServiceType(service.type);
        if(self.plugins.hasOwnProperty(type.plugin)) {
            var plugin = self.plugins[type.plugin];
            plugin.provision(self.zf, env, type.name, service, instance, callback);
        } else {
            callback(new Error("No plugin for '" + service.type + "'"));
        }
    }

    this.createEnvironment = function(name, callback) {
        var self = this;
        self.collectGlobalConfiguration(function(err, config) {
            async.mapSeries(Object.keys(self.zf.services), function(key, callback) {
                var service = self.zf.services[key];
                var type = parseServiceType(service.type);
                if(self.plugins.hasOwnProperty(type.plugin)) {
                    var plugin = self.plugins[type.plugin];
                    plugin.createServiceInstance(self.zf, name, service, key, type.name, function(err, instance) {
                        if(err) {
                            callback(err);
                        } else {
                            callback(null, {
                                serviceName: key,
                                instance: instance
                            });
                        }
                    });
                } else {
                    callback();
                }
            }, function(err, instances) {
                if(err) {
                    callback(err);
                } else {
                    var services = {};
                    instances.forEach(function(instance) {
                        if(instance) {
                            services[instance.serviceName] = instance.instance;
                        }
                    });

                    var env = new Environment(self.zf.name, name, services, config);
                    callback(null, env);
                }
            });
        });
    };

    this.collectGlobalConfiguration = function(callback) {
        // Find the plugins for all services
        var self = this;
        var pluginNames = findPlugins(this.zf.services);

        var config = {};
        
        self.ui.log.info('collecting global configuration information...');
        async.eachSeries(pluginNames, function(pluginName, callback) {
            if(self.plugins.hasOwnProperty(pluginName)) {
                var plugin = self.plugins[pluginName];
                plugin.collectGlobalConfiguration(function(err, pluginConfig) {
                    if(err) { 
                        callback(err);
                    } else {
                        config[pluginName] = pluginConfig;
                        callback();
                    }
                });
            } else {
                callback();
            }
        }, function(err) {
            callback(err, config);
        });
    };

    // this.createServiceInstance = function(env, serviceName, service, callback) {
    //  // Find the plugin for the service
    //  if(!this.plugins.hasOwnProperty(service.type)) {
    //      callback(new Error('no plugin for service type: ' + service.type));
    //  } else {
    //      this.plugins[service.type].createServiceInstance(env, serviceName, service, callback);
    //  }
    // };

    this.loadPlugins = function(dir, callback) {
        var self = this;

        if(typeof dir === "function") {
            callback = dir;
            dir = path.join(__dirname, "plugins");
        }

        self.ui.log.verbose('scanning ' + dir + ' for plugins');
        fs.readdir(dir, function(err, files) {
            if(err) {
                callback(err);
            } else {
                files.forEach(function(file) {
                    if(path.extname(file) === '.js') {
                        self.loadPlugin(path.join(dir, file));
                    }
                });
                callback();
            }
        });
    };

    this.save = function(callback) {
        var self = this;

        // Check for issues
        var issues = self.check();
        if(issues.length > 0) {
            issues.forEach(function(issue) {
                if(issue.type === 'missing_plugin') {
                    self.ui.log.warn("plugin for '" + issue.name + "' could not be found");
                    self.ui.log.warn(" you will not be able to work with the '" + issue.service + "' service");
                }
            });
        }

        // Pretty-print the JSON
        var str = JSON.stringify(self.zf.cryofreeze(), null, 2);
        
        // Write it out
        self.ui.log.verbose('writing Zeusfile: ' + self.path);
        fs.writeFile(self.path, str, callback);
    };
}

Context.prototype.loadPlugin = function(path) {
    require(path).attach(this, this.ui);
};

exports = module.exports = Context;