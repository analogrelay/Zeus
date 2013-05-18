zeus = require 'zeus'
_ = require 'underscore'

exports.init = (ui) ->
	log = ui.cli.output;
	config = ui.cli.category('config')
		.description("Manage configuration settings in Zeus services");

	add = (service, name, template, options, cb) ->
		# Get the zeus service
		zeus.service ui, process.cwd(), service, (err, context, service) ->
			if err? then throw err

			# Check for a conflicting config name
			if service.config.hasOwnProperty name
				ui.log.error "Config setting already defined: " + name
			else
				service.config[name] = new zeus.ConfigSetting template, !options.optional
				context.save cb

	list = (service, options, cb) ->
		# Get the zeus service
		zeus.context ui, process.cwd(), (err, context) ->
			if err? then throw err

			services = context.zeusfile.services
			if service?
				if context.zeusfile.services.hasOwnProperty service
					services = {};
					services[service] = context.zeusfile[service];
				else
					throw new Error 'No such service: ' + name 
			
			_.each services, (service, name, list) ->
				ui.log.info 'Config for ' + name + ':'
				_.each service.config, (value, name, list) ->
					ui.log.help (if value.required then " ! ".red.bold else " ? ".cyan.bold) + 
						name + 
						" = " + 
						(value.template || '<no value>')

			ui.log.help ''
			ui.log.help '!'.red.bold + ' = Required, ' + '?'.cyan.bold + ' = Optional'

			cb()
	
	remove = (service, name, options, cb) ->
		# Get the zeus service
		zeus.service ui, process.cwd(), service, (err, context, service) ->
			if err? then throw err;

			# Check for a conflicting config name
			if service.config.hasOwnProperty name
				delete service.config[name];
				context.save cb;
			else
				ui.log.error("Config setting not defined: " + name);

	config
		.command('add <service> <name> [template]')
		.option('-o, --optional', 'Mark this setting as optional')
		.description('Adds a configuration setting to the specified service')
		.execute(add)

	config
		.command('list [service]')
		.description('Lists configuration settings in the current Zeusfile')
		.execute(list)

	config
		.command('remove <service> <name>')
		.description('Removes a config setting from the specified service')
		.execute(remove)