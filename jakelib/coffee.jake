var fs = require('fs');
var path = require('path');

namespace('coffee', function() {
	desc("Compile CoffeeScript files");
	task('compile', function(src, lib) {
		jake.logger.log(" compiling coffee-script...");
		jake.exec(['coffee --compile --output ' + lib + ' ' + src]);
	});

	desc("Compile CoffeeScript files with coverage");
	task('compile-cov', function(src, lib) {
		jake.logger.log(" compiling coffee-script with coverage...");
		jake.exec(['coffeecoverage ' + src + ' ' + lib]);
	});
});