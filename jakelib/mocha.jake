var cp = require('child_process');

namespace('mocha', function() {
	desc('runs specs');
	task('spec', {async: true}, function(specs) {
		jake.logger.log(" running specs");
		var mocha = cp.spawn('cmd', ['/c', 'mocha', '--compilers', 'coffee:coffee-script', specs], {stdio: 'inherit'});
		mocha.on('exit', function() {
			complete();
		});
	});
});