var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	winston = require('winston'),
	Zeusfile = require('./zeusfile');

function Context(zf, zfpath, log) {
	this.zf = zf;
	this.path = zfpath;
	this._log = log || winston;

	this.plugins = {};
}

/** Check this context for any issues relating to missing plugins */
Context.prototype.check = function() {
	var self = this;
	var issues = [];
	_.each(self.zf.services, function(service, name, list) {
		if(!(service.type in self.provisioners)) {
			issues.push({ type: 'missing_provisioner', name: service.type, service: name });
		}
	});
	return issues;
};

Context.prototype.createServiceInstance = function(env, serviceName, service, callback) {
	// Find the plugin for the service
	if(!(service.type in this.plugins)) {
		callback(new Error('no plugin for service type: ' + service.type));
	} else {
		this.plugins[service.type].createServiceInstance(env, serviceName, service, callback);
	}
};

Context.prototype.loadPlugins = function(cli, log, dir, callback) {
	//var self = this;

	//if(typeof dir === "function") {
	//	callback = dir;
	//	dir = path.join(__dirname, "plugins");
	//}

	//self._log.verbose('scanning ' + dir + ' for plugins');
	//fs.readdir(dir, function(err, files) {
	//	if(err) {
	//		callback(err);
	//	} else {
	//		files.forEach(function(file) {
	//			require(path.join(dir, file)).attach(self, cli, log);
	//		});
	//		callback();
	//	}
	//});
};

Context.prototype.save = function(callback) {
	var self = this;

	// Check for issues
	var issues = self.check();
	if(issues.length > 0) {
		issues.forEach(function(issue) {
			if(issue.type === 'missing_provisioner') {
				self._log.warn("provisioner for '" + issue.name + "' could not be found");
				self._log.warn(" you will not be able to auto-provision the '" + issue.service + "' service");
			}
		});
	}

	// Pretty-print the JSON
	var str = JSON.stringify(Zeusfile.toJSON(self.zf), null, 2);
	
	// Write it out
	self._log.verbose('writing Zeusfile: ' + self.path);
	fs.writeFile(self.path, str, callback);
};

exports = module.exports = Context;