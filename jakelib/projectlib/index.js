module.exports = function(root) {
	namespace(root, function() {
		directory(root+'/lib');

		desc('Compile coffeescript files');
		task('coffee', [root+'/lib'], function() {
			jake.Task['coffee:compile'].invoke(root+'/src/', root+'/lib/');
			jake.Task['coffee:compile'].reenable();
		});

		desc('Compile coffeescript files with coverage');
		task('coffee-cov', [root+'/lib'], function() {
			jake.Task['coffee:compile-cov'].invoke(root+'/src/', root+'/lib-cov/');
			jake.Task['coffee:compile-cov'].reenable();
		});

		desc('Sync JavaScript files');
		task('js', [root+'/lib'], function() {
			jake.Task['js:sync'].invoke(root+'/src/', root+'/lib/');
			jake.Task['js:sync'].reenable();
		});

		desc('Compile/sync files');
		task('compile', ['coffee', 'js']);

		desc('Compile/sync files with coverage');
		task('compile-cov', ['coffee-cov', 'js']);

		desc("Run specs");
		task('specs', ['compile'], function() {
			jake.Task['mocha:spec'].invoke(root+'/spec/');
			jake.Task['mocha:spec'].reenable();
		});

		desc("Run specs with coverage");
		task('cov', ['compile-cov'], function() {
			jake.Task['mocha:coverage'].invoke(root+'/spec/', root);
			jake.Task['mocha:coverage'].reenable();
		});

		desc("Build " + root);
		task('all', ['specs'], function() {
			jake.logger.log("built " + root);
		});
	});
}