utils = require './utils'
ZeusService = require './zeusservice'

module.exports = class Zeusfile
	constructor: (@name = '', @services = {}) ->

	@revive: (obj) ->
		new Zeusfile obj.name, utils.mapObject(obj.services, ZeusService.revive);

	cryofreeze: ->
		name: @name,
		services: utils.mapObject(@services, ZeusService.prototype.cryofreeze)