desc('Build the default stuff');
task('default', ['world']);

desc('Build the world');
task('world', ['zeus:all', 'zeus-cli:all']);

namespace('zeus', function() {
	desc("Build zeus");
	task('all', ['zeus:compile']);

	desc("Compile CoffeeScript files");
	task('compile', function() {
		jake.exec(['coffee --compile --output zeus/lib/ zeus/src/']);
	});
});

namespace('zeus-cli', function() {
	task('all');
});