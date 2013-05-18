namespace('zeus', function() {
	directory('zeus/lib');

	desc("Build zeus");
	task('all', ['zeus/lib'], function() {
		jake.Task['coffee:compile'].invoke('zeus/src/', 'zeus/lib/');
		jake.Task['coffee:compile'].reenable();

		jake.Task['js:sync'].invoke('zeus/src/', 'zeus/lib/');
		jake.Task['js:sync'].reenable();
	});
});