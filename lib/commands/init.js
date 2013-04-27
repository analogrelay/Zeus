exports.init = function(cli) {
	cli
		.command('init <appname>')
		.description('Initializes a new Zeusfile with the specified application name')
		.execute(function(appname, options) {
			console.log("initing " + appname);
		});
}