var zeus = require('zeus'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

exports.init = function(ui) {
	var log = ui.cli.output;
	var env = ui.cli.category('env')
		.description("Manage environments in which Zeus services can be deployed");

	function init(name, outputPath, options, cb) {
		outputPath = outputPath || (path.join(process.cwd(), name + '.zeusspec'));
		fs.exists(outputPath, function(exists) {
			if(exists) {
				log.error("Zeusspec file already exists: " + outputPath);
			}
			else {
				zeus.context(ui, process.cwd(), function(err, context) {
					ui.log.info('Collecting global configuration information...');

					// Create the environment object
					context.createEnvironment(name, function(err, env) {
						if(err) {
							throw err;
						} else {
							// Save it
							env.save(outputPath, cb);
						}
					});
				});
			}
		});
	}

	function provision(spec, service, options, cb) {
		fs.exists(spec, function(exists) {
			if(!exists) {
				log.error("Zeusspec file not found: " + spec);
			}
			else {
				zeus.context(ui, process.cwd(), function(err, context) {
					// Load the Zeus environment
					var env = new zeus.Environment.load(spec);

					if(!(service in env.services)) {
						ui.log.error("Service not defined in the zeusspec: " + service);
					}
					else {
						// Provision the requested environment
						context.provision(service);
					}
				});
			}
		});
	}

	env
		.command('init <name> [outputPath]')
		.description('Initializes an environment with the specified name')
		.execute(init);
	env
		.command('provision <spec> <service>')
		.description('Provisions one of the services defined in a zeusspec file')
		.execute(provision);
}