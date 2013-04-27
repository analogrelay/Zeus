exports.init = function(cli) {
	var service = cli.category('service')
		.description("Manage services in an existing Zeusfile");
	service
		.command('add <name> <type>')
		.description('Add a new service to the current Zeusfile')
		.execute(function(name, type, options) {
			console.log("Adding " + type + " service called " + name);
		});
}