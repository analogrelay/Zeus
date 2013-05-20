utils = require './utils'
ZeusService = require './zeusservice'

module.exports = class Zeusfile
	constructor: (@name = '', services...) ->
		@services = new ZeusService.List(services)

	@$cryo: services: ZeusService.List