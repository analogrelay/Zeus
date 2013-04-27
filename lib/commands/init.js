function init(appname, options, cb) {
	console.log("initing " + appname);
	cb();
}

exports.init = function(cli) {
	cli
		.command('init <appname>')
		.description('Initializes a new Zeusfile with the specified application name')
		.execute(init);
}