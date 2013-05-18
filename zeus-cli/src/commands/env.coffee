zeus = require 'zeus'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'

exports.init = (ui) ->
	log = ui.cli.output;
	env = ui.cli.category('env')
		.description("Manage environments in which Zeus services can be deployed");

	init = (name, outputPath, options, cb) ->
		outputPath ?= path.join process.cwd(), name + '.zeusspec'
		fs.exists outputPath, (exists) ->
			if exists
				log.error("Zeusspec file already exists: " + outputPath);
			else
				zeus.context ui, process.cwd(), (err, context) ->
					# Create the environment object
					context.createEnvironment name, (err, env) ->
						if err? then throw err;

						# Save it
						env.save outputPath, cb

	provision = (spec, service, options, cb) ->
		fs.exists spec, (exists) ->
			if not exists
				log.error "Zeusspec file not found: " + spec
			else
				zeus.context ui, process.cwd(), (err, context) ->
					if err? then throw err;

					# Load the Zeus environment
					zeus.Environment.load spec, (err, env) ->
						if err? then throw err
						
						if env.services.hasOwnProperty service
							# Provision the requested environment
							context.provision env, service, cb
						else
							ui.log.error "Service not defined in the zeusspec: " + service

	env
		.command('init <name> [outputPath]')
		.description('Initializes an environment with the specified name')
		.execute(init);
	env
		.command('provision <spec> <service>')
		.description('Provisions one of the services defined in a zeusspec file')
		.execute(provision);