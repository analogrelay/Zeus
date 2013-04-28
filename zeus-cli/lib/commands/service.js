var zeus = require('zeus'),
	_ = require('underscore');

exports.init = function(cli) {
	var log = cli.output;
	var service = cli.category('service')
		.description("Manage services in an existing Zeusfile");

	function add(name, type, options, cb) {
		// Get the zeus context
		zeus.context(process.cwd(), log, function(err, context) {
			if(err) throw err;
			
			// Check if the service already exists
			if(context.zf.hasService(name)) {
				log.error("Service already defined: " + name);
			} else {
				context.zf.services.push(new zeus.ZeusService(name, type));
				context.save(cb);
			}
		})
	}

	function list(options, cb) {
		// Get the zeus context
		zeus.context(process.cwd(), log, function(err, context) {
			if(err) throw err;

			_.each(context.zf.services, function(value, index, list) {
				log.info(" * " + value.name + ": " + value.type);
			});

			cb();
		});
	}

	function remove(name, options, cb) {
		// Get the zeus context
		zeus.context(process.cwd(), log, function(err, context) {
			if(err) throw err;
			
			// Check if the service exists
			if(!context.zf.hasService(name)) {
				log.error("Service not defined: " + name);
			} else {
				context.zf.removeService(name);
				context.save(cb);
			}
		})
	}

	service
		.command('add <name> <type>')
		.description('Add a new service to the current Zeusfile')
		.execute(add);

	service
		.command('list')
		.description('List services in the current Zeusfile')
		.execute(list);

	service
		.command('remove <name>')
		.description('Remove a service from the current Zeusfile')
		.execute(remove);
}