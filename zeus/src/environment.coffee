_ = require 'underscore'
fs = require 'fs'
log = require 'winston'

utils = require './utils'
ServiceInstance = require './serviceinstance'

module.exports = class Environment
	constructor: (@app = '', @name = '', @config = {}, services...) ->
		@services = new ServiceInstance.List(services)

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

	@$cryo: services: ServiceInstance.List