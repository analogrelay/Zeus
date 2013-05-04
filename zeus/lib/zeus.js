// Global Module References
var package = require('../package'),
	fs = require('fs'),
	path = require('path'),
	winston = require('winston');

// Local File References
var Zeusfile = exports.Zeusfile = require('./zeusfile'),
	Context = exports.Context = require('./context'),
	ZeusService = exports.ZeusService = require('./zeusservice'),
	ConfigSetting = exports.ConfigSetting = require('./configsetting'),
	Environment = exports.Environment = require('./environment'),
	ServiceInstance = exports.ServiceInstance = require('./serviceinstance');

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

function init(cli, log, zfpath, appname, callback) {
	// Create a Zeusfile
	var zf = new Zeusfile();
	zf.name = appname;

	// Build a context around that Zeusfile and return it.
	log.verbose('initializing Zeus context: ' + zfpath);
	var context = new Context(zf, zfpath, log);
	context.loadPlugins(cli, log, function(err) {
		if(err) {
			callback(err);
		} else {
			callback(context);
		}
	});
}

function load(cli, log, zfpath, callback) {
	// Read the Zeusfile
	log.verbose('reading Zeusfile: ' + zfpath);
	fs.readFile(zfpath, function(err, data) {
		if(err) {
			callback(err);
		} else {
			log.verbose('reviving Zeusfile');
			var zf = Zeusfile.revive(JSON.parse(data));
			var context = new Context(zf, zfpath, log);
			context.loadPlugins(cli, log, function(err) {
				if(err) {
					callback(err);
				} else {
					callback(null, context);
				}
			});
		}
	});
}

// Exports
exports.version = package.version;

/** Loads or creates the Zeus context for the specified directory */
exports.context = function(workingDirectory, appname, callback) {
	var cli = {};
	var log = winston;

	if(typeof appname === 'function') {
		callback = appname;
		appname = null;
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
				init(cli, log, zfpath, appname, callback);
			}
		});
	} else {
		// Find the zeusfile
		findZeusfile(log, workingDirectory, function(err, zfpath) {
			if(err) {
				callback(err);
			} else {
				load(cli, log, zfpath, callback);
			}
		});
	}
};

/** Shortcut to go straight to a specific service in an existing Zeus context */
exports.service = function(cli, log, workingDirectory, serviceName, callback) {
	exports.context(cli, log, workingDirectory, function(err, context) {
		if(err) {
			callback(err);
		} else if(serviceName in context.zf.services) {
			callback(null, context, context.zf.services[serviceName]);
		} else {
			callback(new Error("Service not defined: " + serviceName));
		}
	});
};

module.exports = exports;