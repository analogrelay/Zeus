var fs = require('fs'),
	winston = require('winston');

function Context(zf, zfpath, log) {
	this.zf = zf;
	this.path = zfpath;
	this._log = log || winston;
}
Context.prototype.save = function(callback) {
	// Pretty-print the JSON
	var str = JSON.stringify(this.zf.cryo(), null, 2);
	
	// Write it out
	this._log.verbose('writing Zeusfile: ' + this.path);
	fs.writeFile(this.path, str, callback);
};

exports = module.exports = Context;