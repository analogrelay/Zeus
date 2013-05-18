namespace('zeus-cli', function() {
	directory('zeus-cli/lib');

	desc("Build zeus-cli");
	task('all', ['zeus-cli/lib'], function() {
		jake.Task['coffee:compile'].invoke('zeus-cli/src/', 'zeus-cli/lib/');
		jake.Task['coffee:compile'].reenable();

		jake.Task['js:sync'].invoke('zeus-cli/src/', 'zeus-cli/lib/');
		jake.Task['js:sync'].reenable();
	});
});