namespace('coffee', function() {
	desc("Compile CoffeeScript files");
	task('compile', function(src, lib) {
		jake.logger.log(" compiling coffee-script...");
		jake.exec(['coffee --compile --output ' + lib + ' ' + src]);
	});
})