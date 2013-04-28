var zeus = require('zeus');

exports.init = function(cli) {
	var log = cli.output;
	var service = cli.category('service')
		.description("Manage services in an existing Zeusfile");

	function add(name, type, options, cb) {
		// Get the zeus context
		zeus.context(process.cwd(), log, function(err, context) {
			// Check if the service already exists
			if(err) throw err;
			if(name in context.zf.services) {
				log.error("Service already defined: " + name);
			} else {
				context.zf.services[name] = new zeus.ZeusService(type);
				context.save(cb);
			}
		})
	}

	service
		.command('add <name> <type>')
		.description('Add a new service to the current Zeusfile')
		.execute(add);
}