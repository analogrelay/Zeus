utils = require './utils'
ZeusService = require './zeusservice'

module.exports = class Zeusfile
	constructor: (@name = '', @services = {}) ->

	@$cryo: services: ZeusService.List