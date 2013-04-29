var zeus = require('zeus'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

exports.init = function(cli) {
	var log = cli.output;
	var env = cli.category('env')
		.description("Manage environments in which Zeus services can be deployed");

	function init(name, outputPath, options, cb) {
		outputPath = outputPath || (path.join(process.cwd(), name + '.zeusspec'));
		fs.exists(outputPath, function(exists) {
			if(exists) {
				log.error("Zeusspec file already exists: " + outputPath);
			}
			else {
				zeus.context(process.cwd(), log, function(err, context) {
					// Build a Zeus Environment
					var env = new zeus.Environment(context.zf.name, name);

					// Create service instances using the initializers
					_.each(context.zf.services, function(service, serviceName, list) {
						env.services[serviceName] = context.createInstance(name, serviceName, service);
					});

					// Save the environment
					env.save(outputPath, function(err) {
						if(err) throw err;

						log.warn("Saved " + outputPath + ". This contains/will contain secret data! Make sure you store it " + "outside".yellow.bold + " your source code repository");
					});
				});
			}
		});
	}

	env
		.command('init <name> [outputPath]')
		.description('Initializes an environment with the specified name')
		.execute(init);
}