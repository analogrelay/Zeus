desc('Build the default stuff');
task('default', ['world']);

desc('Build the world');
task('world', ['zeus:nation', 'zeus-cli:nation']);

namespace('zeus', function() {
	desc("Build the zeus nation");
	task('nation', ['zeus:compile']);

	desc("Compile CoffeeScript files");
	task('compile', function() {
		jake.exec(['coffee --compile --output zeus/lib/ zeus/src/']);
	});
});

namespace('zeus-cli', function() {
	task('nation');
});