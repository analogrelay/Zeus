var zeus = require('zeus'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

exports.init = function(cli) {
	var log = cli.output;
	var env = cli.category('env')
		.description("Manage environments in which Zeus services can be deployed");

	function createInstances(context, env, serviceName, rest, callback) {
		context.createInstance(env, serviceName, context.zf.services[serviceName], function (err, instance) {
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
				zeus.context(cli, log, process.cwd(), function(err, context) {
					// Build a Zeus Environment
					var env = new zeus.Environment(context.zf.name, name);

					// Create service instances using the initializers
					var services = Object.keys(context.zf.services);
					createInstances(context, env, _.first(services), _.rest(services), function(err) {
						if(err) throw err;

						// Save the environment
						env.save(outputPath, function(err) {
							if(err) throw err;

							log.warn("Saved " + outputPath + ". This contains/will contain secret data! Make sure you store it " + "outside".yellow.bold + " your source code repository");
							cb();
						});
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
				zeus.context(process.cwd(), log, function(err, context) {
					// Load the Zeus environment
					var env = new zeus.Environment.load(spec);

					if(!(service in env.services)) {
						log.error("Service not defined in the zeusspec: " + service);
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