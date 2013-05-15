var zeus = require('zeus'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

exports.init = function(ui) {
	var log = ui.cli.output;
	var env = ui.cli.category('env')
		.description("Manage environments in which Zeus services can be deployed");

	function createInstances(context, env, serviceName, rest, callback) {
		context.createServiceInstance(env, serviceName, context.zf.services[serviceName], function (err, instance) {
			if(err) {
				callback(err);
			} else {
				env.services[serviceName] = instance;
				if(rest.length == 0) {
					callback();
				} else {
					createInstances(context, env, _.first(rest), _.rest(rest), callback);
				}
			}
		});
	}

	function init(name, outputPath, options, cb) {
		outputPath = outputPath || (path.join(process.cwd(), name + '.zeusspec'));
		fs.exists(outputPath, function(exists) {
			if(exists) {
				log.error("Zeusspec file already exists: " + outputPath);
			}
			else {
				zeus.context(ui, process.cwd(), function(err, context) {
					// Collect global configuration to apply to the environment
					context.collectGlobalConfiguration(function(err, config) {
						if(err) {
							throw err;
						} else {
							// Build a Zeus Environment
							var env = new zeus.Environment(context.zf.name, name, {}, config);

							// Save it
							env.save(outputPath, cb);
						}
					})
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