namespace('zeus-cli', function() {
	directory('zeus-cli/lib');

	desc('Compile coffeescript files');
	task('coffee', ['zeus-cli/lib'], function() {
		jake.Task['coffee:compile'].invoke('zeus-cli/src/', 'zeus-cli/lib/');
		jake.Task['coffee:compile'].reenable();
	});

	desc('Sync JavaScript files');
	task('js', ['zeus/lib'], function() {
		jake.Task['js:sync'].invoke('zeus-cli/src/', 'zeus-cli/lib/');
		jake.Task['js:sync'].reenable();
	});

	desc("Run specs");
	task('mocha', ['coffee', 'js'], function() {
		jake.Task['mocha:spec'].invoke('zeus-cli/spec/');
		jake.Task['mocha:spec'].reenable();
	});

	desc("Build zeus");
	task('all', ['mocha'], function() {
		jake.logger.log("built zeus-cli!");
	});
});