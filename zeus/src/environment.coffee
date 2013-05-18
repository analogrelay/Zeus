_ = require 'underscore'
fs = require 'fs'
log = require 'winston'

utils = require './utils'
ServiceInstance = require './serviceinstance'

module.exports = class Environment
	constructor: (@app = '', @name = '', @services = {}, @config = {}) ->

	# Loads a true Environment object out of a plain JS object with matching properties
	@revive: (path, obj) ->
		[obj, path] = [path, null] if typeof path is 'object'

		env = new Environment(
			obj.app, 
			obj.name, 
			utils.mapObject(obj.services, ServiceInstance.revive),
			obj.config)
		env.path = path if path?
		return env

	cryofreeze: ->
		app: @app,
		name: @name,
		services: utils.mapObject(@services, ServiceInstance.prototype.cryofreeze),
		config: @config

	load: (path, callback) ->
		# Read the file
		fs.readFile path, (err, data) ->
			if err
				callback err
			else
				callback null, Environment.revive(path, JSON.parse data)

	save: (path, callback) ->
		[callback, path] = [path, @path] if typeof path is 'function'

		# Pretty-print the JSON
		str = JSON.stringify @cryofreeze(), null, 2
		
		# Write it out
		log.verbose 'writing Zeusspec: ' + path
		fs.writeFile path, str, callback