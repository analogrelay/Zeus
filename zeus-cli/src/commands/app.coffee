zeus = require 'zeus'

exports.init = (ui) ->
	log = ui.cli.output;
	app = ui.cli.category('app')
		.description('Commands for managing Zeusfiles')

	init = (appname, options, cb) ->
		# Set up a zeus context
		zeus.context ui, process.cwd(), appname, (err, context) ->
			if err? then throw err

			ui.log.info "Saving new Zeusfile to: " + context.path
			context.save cb

	app.command('init <appname>')
		.description('Initializes a new Zeusfile with the specified application name')
		.execute(init);