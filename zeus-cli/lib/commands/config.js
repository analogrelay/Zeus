var zeus = require('zeus'),
	_ = require('underscore');

exports.init = function(ui) {
	var log = ui.cli.output;
	var config = ui.cli.category('config')
		.description("Manage configuration settings in Zeus services");

	function add(service, name, template, options, cb) {
		// Get the zeus service
		zeus.service(ui, process.cwd(), service, function(err, context, service) {
			if(err) throw err;

			// Check for a conflicting config name
			if(name in service.config) {
				ui.log.error("Config setting already defined: " + name);
			} else {
				service.config[name] = new zeus.ConfigSetting(template, !options.optional);
				context.save(cb);
			}
		});
	}

	function list(service, options, cb) {
		// Get the zeus service
		zeus.context(ui, process.cwd(), function(err, context) {
			if(err) throw err;

			var services = context.zf.services;
			if(service) {
				if(!(service in context.zf.services)) {
					ui.log.error('No such servie: ' + name);
				}
				services = {};
				services[service] = context.zf.services[service];
			}

			_.each(services, function(service, name, list) {
				ui.log.info('Config for ' + name + ':');
				_.each(service.config, function(value, name, list) {
					ui.log.info(
						(value.required ? " ! ".red.bold : " ? ".cyan.bold) +
						name + " = " +
						(value.template || '<no value>'));
				});
			});
			ui.log.info('');
			ui.log.info('!'.red.bold + ' = Required, ' + '?'.cyan.bold + ' = Optional');

			cb();
		});
	}

	function remove(service, name, options, cb) {
		// Get the zeus service
		zeus.service(ui, process.cwd(), service, function(err, context, service) {
			if(err) throw err;

			// Check for a conflicting config name
			if(!(name in service.config)) {
				ui.log.error("Config setting not defined: " + name);
			} else {
				delete service.config[name];
				context.save(cb);
			}
		});
	}

	config
		.command('add <service> <name> [template]')
		.option('-o, --optional', 'Mark this setting as optional')
		.description('Adds a configuration setting to the specified service')
		.execute(add);

	config
		.command('list [service]')
		.description('Lists configuration settings in the current Zeusfile')
		.execute(list);

	config
		.command('remove <service> <name>')
		.description('Removes a config setting from the specified service')
		.execute(remove);
}