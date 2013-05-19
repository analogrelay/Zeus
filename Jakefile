desc('Build the default stuff');
task('default', ['world']);

desc('Build the world');
task('world', ['zeus:all', 'zeus-cli:all']);

desc('Build code coverage');
task('cov', ['zeus:cov', 'zeus-cli:cov']);

desc('Do travis things');
task('travis', ['world']);