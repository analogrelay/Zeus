var zeus = require('zeus');

exports.init = function(cli) {
	var log = cli.output;
	var app = cli.category('app')
		.description('Commands for managing Zeusfiles')

	function init(appname, options, cb) {
		// Set up a zeus context
		var context = zeus.context(process.cwd(), appname, log);
		log.info("Saving new Zeusfile to: " + context.path);
		context.save(cb);
	}

	app
		.command('init <appname>')
		.description('Initializes a new Zeusfile with the specified application name')
		.execute(init);
}