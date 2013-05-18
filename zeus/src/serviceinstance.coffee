module.exports = class ServiceInstance
	constructor: (@config = {}) ->

	# Loads a true Environment object out of a plain JS object with matching properties
	@revive: (obj) ->
		new ServiceInstance obj.config

	# Returns a copy of the object designed for cleaner JSON serialization
	cryofreeze: -> config: @config