var path = require('path');
var fs = require('fs');

function mkdirp(dir) {
	// Does this dir exist?
	if(fs.existsSync(dir)) {
		// Done!
		return;
	} else {
		var parent = path.dirname(dir)
		if(parent !== dir) {
			// We haven't hit the root yet
			mkdirp(parent);
		}
		// Make this dir
		fs.mkdirSync(dir);
	}
}

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

			// Jake.MkdirP is Derpy on Windows
			mkdirp(path.dirname(dest));
			jake.cpR(source, dest);
		});
	});
});