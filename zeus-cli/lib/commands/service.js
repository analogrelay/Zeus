// Generated by CoffeeScript 1.4.0
(function() {
  var zeus, _,
    __hasProp = {}.hasOwnProperty;

  zeus = require('zeus');

  _ = require('underscore');

  exports.init = function(ui) {
    var add, list, log, remove, service;
    log = ui.cli.output;
    service = ui.cli.category('service').description("Manage services in an existing Zeusfile");
    add = function(name, type, options, cb) {
      return zeus.context(ui, process.cwd(), function(err, context) {
        if (err != null) {
          throw err;
        }
        if (context.zeusfile.services.hasOwnProperty(name)) {
          return ui.log.error("Service already defined: " + name);
        } else {
          context.zeusfile.services[name] = new zeus.ZeusService(type);
          return context.save(cb);
        }
      });
    };
    list = function(options, cb) {
      return zeus.context(ui, process.cwd(), function(err, context) {
        var key, _ref;
        if (err != null) {
          throw err;
        }
        _ref = context.zeusfile.services;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          ui.log.info(" * " + key + ":" + context.zeusfile.services[key].type);
        }
        return cb();
      });
    };
    remove = function(name, options, cb) {
      return zeus.context(ui, process.cwd(), function(err, context) {
        if (err != null) {
          throw err;
        }
        if (context.zeusfile.services.hasOwnProperty(name)) {
          delete context.zeusfile.services[name];
          return context.save(cb);
        } else {
          return ui.log.error("Service not defined: " + name);
        }
      });
    };
    service.command('add <name> <type>').description('Add a new service to the current Zeusfile').execute(add);
    service.command('list').description('List services in the current Zeusfile').execute(list);
    return service.command('remove <name>').description('Remove a service from the current Zeusfile').execute(remove);
  };

}).call(this);
