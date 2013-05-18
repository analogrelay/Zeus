var path = require('path');
var fs = require('fs');

namespace('js', function() {
	desc('sync source files to lib');
	task('sync', function(src, lib) {
		console.log(" " + src + "*.js -> " + lib + "*.js");
		var sourcefiles = jake.readdirR(src).filter(function(file) {
			return path.extname(file) === '.js';
		});

		sourcefiles.forEach(function(file) {
			var rel = path.relative(src, file);
			var source = path.join(src, rel);
			var dest = path.join(lib, rel);
			jake.mkdirP(path.dirname(dest));
			jake.cpR(source, dest);
		});
	});
});