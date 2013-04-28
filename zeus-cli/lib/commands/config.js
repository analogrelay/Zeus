var zeus = require('zeus'),
	_ = require('underscore');

exports.init = function(cli) {
	var log = cli.output;
	var service = cli.category('service')
		.description("Manage services in an existing Zeusfile");

	function add(service, name, template, options, cb) {
		// // Get the zeus service
		// zeus.service(process.cwd(), name, log, function(err, service) {
			
		// });
	}

	function list(options, cb) {
	}

	function remove(options, cb) {
	}

	service
		.command('add <service> <name> [template]')
		.description('Adds a configuration setting to the specified service')
		.execute(add);

	service
		.command('list [service]')
		.description('Lists configuration settings in the current Zeusfile')
		.execute(list);

	service
		.command('remove <service> <name>')
		.description('Removes a config setting from the specified service')
		.execute(remove);
}