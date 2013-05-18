module.exports = class Plugin
	constructor: (@context, @ui) ->
		@serviceTypes = {}

	collectGlobalConfiguration: (callback) ->
		# Nothing to do by default

	createServiceInstance: (zeusfile, environmentName, service, serviceName, type, callback) ->
		if @serviceTypes.hasOwnProperty type
			@serviceTypes[type].createInstance zeusfile, environmentName, service, serviceName, callback
		else
			callback new Error "No handler for service type '" + type + "' registered."

	provision: (zeusfile, env, type, service, instance, callback) ->
		if @serviceTypes.hasOwnProperty type
			@serviceTypes[type].provision zeusfile, env, service, instance, callback
		else
			callback new Error "No handler for service type '" + type + "' registered."