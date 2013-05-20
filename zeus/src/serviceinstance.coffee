utils = require './utils'

module.exports = class ServiceInstance
	constructor: (@name, @config = {}) ->

	@List: utils.keyedListFor 'name', ServiceInstance