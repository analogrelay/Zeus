// Global Module References
var package = require('../package'),
	fs = require('fs'),
	path = require('path'),
	winston = require('winston');

// Local File References
var Zeusfile = exports.Zeusfile = require('./zeusfile'),
	Context = exports.Context = require('./context');

// Local Functions
function findZeusfile(dir) {
	var lastDir;
	while((lastDir !== dir) && !fs.existsSync(path.join(dir, 'Zeusfile'))) {
		lastDir = dir;
		dir = path.dirname(dir); // This will return 'dir' if we're already at the base, hence the lastdir check.
	}
	var zf = path.join(dir, 'Zeusfile');
	if(fs.existsSync(zf)) {
		return zf;
	}
	return null;
}

function init(zfpath, appname, log) {
	// Create a Zeusfile
	var zf = new Zeusfile();
	zf.name = appname;

	// Build a context around that Zeusfile.
	return new Context(zf, zfpath, log);
}

function load(zfpath, log) {

}

// Exports
exports.version = package.version;

exports.context = function(workingDirectory, appname, log) {
	if(typeof appname !== 'string') {
		// Appname is a log
		log = appname;
		appname = null;
	}

	var zfpath = path.join(workingDirectory, 'Zeusfile');
	if(appname) {
		// Check for a zeusfile locally
		if(fs.existsSync(zfpath)) {
			// Can't create a new one
			throw new Error("Can't create a new Zeusfile. There is already one in this directory");
		}
		// Ok, just use this as the working directory and initialize a new ZF regardless of the parents
		return init(zfpath, appname, log);
	} else {
		// Find the zeusfile
		zfpath = findZeusfile(workingDirectory);
		if(!zfpath) {
			throw new Error("No Zeusfile found!");
		}
		return load(zfpath, log);
	}
};

module.exports = exports;