var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	winston = require('winston'),
	UIService = require('./ui');

function Context(zf, zfpath, ui) {
	this.zf = zf;
	this.path = zfpath;

	ui = ui || UIService.empty;
	
	this.plugins = {};

	/** Check this context for any issues relating to missing plugins */
	this.check = function() {
		var self = this;
		var issues = [];
		_.each(self.zf.services, function(service, name, list) {
			if(!(service.type in self.plugins)) {
				issues.push({ type: 'missing_plugin', name: service.type, service: name });
			}
		});
		return issues;
	};

	this.createServiceInstance = function(env, serviceName, service, callback) {
		// Find the plugin for the service
		if(!(service.type in this.plugins)) {
			callback(new Error('no plugin for service type: ' + service.type));
		} else {
			this.plugins[service.type].createServiceInstance(env, serviceName, service, callback);
		}
	};

	this.loadPlugin = function(path) {
		require(path).attach(this, ui);
	};

	this.loadPlugins = function(dir, callback) {
		var self = this;

		if(typeof dir === "function") {
			callback = dir;
			dir = path.join(__dirname, "plugins");
		}

		ui.log.verbose('scanning ' + dir + ' for plugins');
		fs.readdir(dir, function(err, files) {
			if(err) {
				callback(err);
			} else {
				files.forEach(function(file) {
					if(path.extname(file) === '.js') {
						self.loadPlugin(path.join(dir, file));
					}
				});
				callback();
			}
		});
	};

	this.save = function(callback) {
		var self = this;

		// Check for issues
		var issues = self.check();
		if(issues.length > 0) {
			issues.forEach(function(issue) {
				if(issue.type === 'missing_plugin') {
					ui.log.warn("plugin for '" + issue.name + "' could not be found");
					ui.log.warn(" you will not be able to work with the '" + issue.service + "' service");
				}
			});
		}

		// Pretty-print the JSON
		var str = JSON.stringify(self.zf.cryofreeze(), null, 2);
		
		// Write it out
		ui.log.verbose('writing Zeusfile: ' + self.path);
		fs.writeFile(self.path, str, callback);
	};
}

exports = module.exports = Context;