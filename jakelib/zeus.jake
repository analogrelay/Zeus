namespace('zeus', function() {
	directory('zeus/lib');

	desc('Compile coffeescript files');
	task('coffee', ['zeus/lib'], function() {
		jake.Task['coffee:compile'].invoke('zeus/src/', 'zeus/lib/');
		jake.Task['coffee:compile'].reenable();
	});

	desc('Sync JavaScript files');
	task('js', ['zeus/lib'], function() {
		jake.Task['js:sync'].invoke('zeus/src/', 'zeus/lib/');
		jake.Task['js:sync'].reenable();
	});

	desc('Compile/sync files');
	task('compile', ['coffee', 'js']);

	desc("Run specs");
	task('spec', ['compile'], function() {
		jake.Task['mocha:spec'].invoke('zeus/spec/');
		jake.Task['mocha:spec'].reenable();
	});

	desc("Build zeus");
	task('all', ['spec'], function() {
		jake.logger.log("built zeus!");
	});
});