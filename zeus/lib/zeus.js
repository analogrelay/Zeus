// Global Module References
var package = require('../package'),
	fs = require('fs'),
	path = require('path'),
	winston = require('winston');

// Local File References
var Zeusfile = exports.Zeusfile = require('./zeusfile'),
	Context = exports.Context = require('./context'),
	ZeusService = exports.ZeusService = require('./zeusservice');

// Local Functions
function findZeusfile(log, dir, callback) {
	var zfpath = path.join(dir, 'Zeusfile');
	log.verbose("searching for Zeusfile in " + dir);
	fs.exists(zfpath, function(exists) {
		if(exists) return callback(null, zfpath);

		var newdir = path.dirname(dir);
		if(newdir == dir) {
			callback(new Error("No Zeusfile found!")); // No luck and we're at the top of the directory tree
		} else {
			findZeusfile(log, newdir, callback);
		}
	});
}

function init(zfpath, appname, log, callback) {
	// Create a Zeusfile
	var zf = new Zeusfile();
	zf.name = appname;

	// Build a context around that Zeusfile and return it.
	log.verbose('initializing Zeus context: ' + zfpath)
	callback(null, new Context(zf, zfpath, log));
}

function load(zfpath, log, callback) {
	// Read the Zeusfile
	log.verbose('reading Zeusfile: ' + zfpath)
	fs.readFile(zfpath, function(err, data) {
		if(err) {
			callback(err);
		} else {
			log.verbose('reviving Zeusfile');
			var zf = Zeusfile.revive(JSON.parse(data));
			callback(null, new Context(zf, zfpath, log));
		}
	});
}

// Exports
exports.version = package.version;

exports.context = function(workingDirectory, appname, log, callback) {
	if(typeof appname !== 'string') {
		// Appname is a log
		callback = log;
		log = appname;
		appname = null;
	}
	if(typeof log === 'function') {
		// Log is a callback
		callback = log;
		log = winston;
	}
	log.verbose('loading Zeus context for ' + workingDirectory);

	var zfpath = path.join(workingDirectory, 'Zeusfile');
	if(!!appname) {
		// Check for a zeusfile locally
		fs.exists(zfpath, function(exists) {
			if(exists) {
				// Can't create a new one
				callback(new Error("Can't create a new Zeusfile. There is already one in this directory"));
			}
			else {
				// Ok, just use this as the working directory and initialize a new ZF regardless of the parents
				init(zfpath, appname, log, callback);
			}
		});
	} else {
		// Find the zeusfile
		findZeusfile(log, workingDirectory, function(err, zfpath) {
			if(err) {
				callback(err);
			} else {
				load(zfpath, log, callback);
			}
		});
	}
};

module.exports = exports;