utils = require './utils'

module.exports = class ServiceInstance
	constructor: (@name, @serviceName, @config = {}) ->

	@List: utils.keyedListFor 'serviceName', ServiceInstance