zeus = require 'zeus'
_ = require 'underscore'

exports.init = (ui) ->
	log = ui.cli.output;
	service = ui.cli.category('service')
		.description("Manage services in an existing Zeusfile");

	add = (name, type, options, cb) ->
		# Get the zeus context
		zeus.context ui, process.cwd(), (err, context) ->
			if err? then throw err
			
			# Check if the service already exists
			if context.zeusfile.services.hasOwnProperty name
				ui.log.error "Service already defined: " + name;
			else
				context.zeusfile.services[name] = new zeus.ZeusService type
				context.save cb

	list = (options, cb) ->
		# Get the zeus context
		zeus.context ui, process.cwd(), (err, context) ->
			if err? then throw err

			for own key of context.zeusfile.services
				ui.log.info " * " + key + ":" + context.zeusfile.services[key].type
			
			cb()

	remove = (name, options, cb) ->
		# Get the zeus context
		zeus.context ui, process.cwd(), (err, context) ->
			if err? then throw err
			
			# Check if the service exists
			if context.zeusfile.services.hasOwnProperty name
				delete context.zeusfile.services[name];
				context.save cb
			else
				ui.log.error "Service not defined: " + name
			
	service
		.command('add <name> <type>')
		.description('Add a new service to the current Zeusfile')
		.execute(add)

	service
		.command('list')
		.description('List services in the current Zeusfile')
		.execute(list)

	service
		.command('remove <name>')
		.description('Remove a service from the current Zeusfile')
		.execute(remove)