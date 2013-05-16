var cli = require('../lib/cli.js');
cli.parse(process.argv);
if(cli.args.length == 0) {
	cli.parse(['', '', '-h']);
}