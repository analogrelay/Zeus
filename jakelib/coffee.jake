namespace('coffee', function() {
	desc("Compile CoffeeScript files");
	task('compile', function(src, lib) {
		jake.exec(['coffee --compile --output ' + lib + ' ' + src]);
	});
})