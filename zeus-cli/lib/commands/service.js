var zeus = require('zeus');

function add(name, type, options, cb) {
	// Get the zeus context
	var context = zeus.context(process.cwd())
	cb();
}

exports.init = function(cli) {
	var service = cli.category('service')
		.description("Manage services in an existing Zeusfile");
	service
		.command('add <name> <type>')
		.description('Add a new service to the current Zeusfile')
		.execute(add);
}