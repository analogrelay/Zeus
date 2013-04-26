var program = require('commander');

exports.run = function(argv) {
	program.version('0.0.1');

	program
		.command('init <appname>')
		.description("Initializes a new Zeusfile")
		.action(function(appname, options) {
			console.log("init");
		})

	program
		.command('*')
		.action(function() {
			program.showHelp();
		})

	program.parse(argv);
}