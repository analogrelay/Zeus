utils = require('./utils')
ZeusService = require('./zeusservice')

class Zeusfile
	constructor: (@name, @services) ->

	@revive: obj ->
		new Zeusfile obj.name, utils.mapObject(obj.services, ZeusService.revive);

	cryofreeze: ->
		{
			name: @name,
			services: utils.mapObject(@services, ZeusService.prototype.cryofreeze)
		}
exports = module.exports = Zeusfile;