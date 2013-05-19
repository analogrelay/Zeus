var cp = require('child_process');
var path = require('path');
var fs = require('fs');

var root = path.resolve(__dirname, '..')
var reports = path.join(root, 'build')

function runMocha(specs, reporter, outputFile, callback) {
	jake.logger.log(" running specs");

	var list = new jake.FileList();
	list.include(path.join(specs, '*.js'));
	list.include(path.join(specs, '**/*.js'));
	list.include(path.join(specs, '*.coffee'));
	list.include(path.join(specs, '**/*.coffee'));

	var baseArgs = ['/c', 'mocha', '--compilers', 'coffee:coffee-script', '--reporter', reporter]
	var args = baseArgs.concat(list.toArray())
	//console.log(" running cmd " + args.join(''));

	var output = process.stdout;
	var fileOutput;
	if(outputFile) {
		if(!fs.existsSync(reports)) {
			fs.mkdirSync(reports)
		}
		var file = path.join(reports, outputFile);
		console.log(' writing report to ' + file)
		output = fileOutput = fs.openSync(file, 'w+');
	}

	var mocha = cp.spawn('cmd', args, {stdio: [process.stdin, output, process.stderr]});
	mocha.on('exit', function() {
		if(fileOutput) {
			fs.closeSync(fileOutput);
		}
		callback();
	});
}

namespace('mocha', function() {
	desc('runs specs');
	task('spec', {async: true}, function(specs) {
		runMocha(specs, 'progress', void 0, complete);
	});

	desc('runs specs with coverage');
	task('coverage', {async: true}, function(specs, name) {
		process.env.ZEUS_COV = 1;
		runMocha(specs, 'html-cov', name + '.cov.html', function() {
			delete process.env.ZEUS_COV
			complete();
		});
	});
});