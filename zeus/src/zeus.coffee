# Global Module References
fs = require 'fs'
path = require 'path'
winston = require 'winston'

# Local File References
Zeusfile = exports.Zeusfile = require './zeusfile'
Context = exports.Context = require './context'
ZeusService = exports.ZeusService = require './zeusservice'
ConfigSetting = exports.ConfigSetting = require './configsetting'
Environment = exports.Environment = require './environment'
ServiceInstance = exports.ServiceInstance = require './serviceinstance'
UIService = exports.UIService = require './ui'

# Utils
utils = exports.utils = require './utils'
cryo = exports.cryo = require './utils/cryo'

# Local Functions
findZeusfile = (ui, dir, callback) ->
	zfpath = path.join dir, 'Zeusfile'
	ui.log.verbose "searching for Zeusfile in " + dir
	fs.exists zfpath, (exists) ->
		return callback null, zfpath if exists

		newdir = path.dirname dir;
		if newdir == dir
			# No luck and we're at the top of the directory tree
			callback new Error "No Zeusfile found!"
		else
			findZeusfile ui, newdir, callback

init = (ui, zfpath, appname, callback) ->
	# Create a Zeusfile
	zf = new Zeusfile
	zf.name = appname

	# Build a context around that Zeusfile and return it.
	ui.log.verbose 'initializing Zeus context: ' + zfpath
	context = new Context zf, zfpath, ui
	context.loadPlugins (err) ->
		if err
			callback err
		else
			callback null, context

load = (ui, zfpath, callback) ->
	# Read the Zeusfile
	ui.log.verbose 'reading Zeusfile: ' + zfpath
	fs.readFile zfpath, (err, data) ->
		if err
			callback err
		else
			ui.log.verbose 'reviving Zeusfile'
			zf = cryo.revive JSON.parse(data), Zeusfile
			context = new Context zf, zfpath, ui;
			context.loadPlugins (err) ->
				if err
					callback err
				else
					callback null, context

# Exports
exports.version = (require '../package.json').version

# Loads or creates the Zeus context for the specified directory
exports.context = context = (ui, workingDirectory, appname, callback) ->
	# Overload handling
	[callback, appname] = [appname, null] if typeof appname is 'function'

	ui.log.verbose 'loading Zeus context for ' + workingDirectory

	zfpath = path.join workingDirectory, 'Zeusfile'
	if appname?
		# Check for a zeusfile locally
		fs.exists zfpath, (exists) ->
			if exists
				# Can't create a new one
				callback new Error "Can't create a new Zeusfile. There is already one in this directory"
			else
				# Ok, just use this as the working directory and initialize a new ZF regardless of the parents
				init ui, zfpath, appname, callback
	else
		# Find the zeusfile
		findZeusfile ui, workingDirectory, (err, zfpath) ->
			if err
				callback err
			else
				load ui, zfpath, callback

# Shortcut to go straight to a specific service in an existing Zeus context
exports.service = service = (ui, workingDirectory, serviceName, callback) ->
	exports.context ui, workingDirectory, (err, context) ->
		if err
			callback err
		else if serviceName in context.zf.services
			callback null, context, context.zf.services[serviceName]
		else
			callback new Error "Service not defined: " + serviceName

module.exports = exports