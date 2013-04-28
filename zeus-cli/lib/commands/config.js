var zeus = require('zeus'),
	_ = require('underscore');

exports.init = function(cli) {
	var log = cli.output;
	var config = cli.category('config')
		.description("Manage configuration settings in Zeus services");

	function add(service, name, template, options, cb) {
		// Get the zeus service
		zeus.service(process.cwd(), name, log, function(err, context, service) {
			if(err) throw err;

			// Check for a conflicting config name
			if(name in service.config) {
				log.error("Config setting already defined: " + name);
			} else {
				service.config.push(new zeus.ConfigSetting(template, true));
				context.save(cb);
			}
		});
	}

	function list(options, cb) {
	}

	function remove(options, cb) {
	}

	config
		.command('add <service> <name> [template]')
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