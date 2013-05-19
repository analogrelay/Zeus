var cp = require('child_process');
var path = require('path');

namespace('mocha', function() {
	desc('runs specs');
	task('spec', {async: true}, function(specs) {
		jake.logger.log(" running specs");

		var list = new jake.FileList();
		list.include(path.join(specs, '*.js'));
		list.include(path.join(specs, '**/*.js'));
		list.include(path.join(specs, '*.coffee'));
		list.include(path.join(specs, '**/*.coffee'));

		var baseArgs = ['/c', 'mocha', '--compilers', 'coffee:coffee-script', '--reporter', 'progress']
		var args = baseArgs.concat(list.toArray())

		var mocha = cp.spawn('cmd', args, {stdio: 'inherit'});
		mocha.on('exit', function() {
			complete();
		});
	});
});