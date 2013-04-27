function add(name, type, options, cb) {
	console.log("Adding " + type + " service called " + name);
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