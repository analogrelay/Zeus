var zeus = require('zeus');

exports.init = function(ui) {
	var log = ui.cli.output;
	var app = ui.cli.category('app')
		.description('Commands for managing Zeusfiles')

	function init(appname, options, cb) {
		// Set up a zeus context
		zeus.context(ui, process.cwd(), appname, function(err, context) {
			if(err) throw err;

			ui.log.info("Saving new Zeusfile to: " + context.path);
			context.save(cb);
		});
	}

	app
		.command('init <appname>')
		.description('Initializes a new Zeusfile with the specified application name')
		.execute(init);
}