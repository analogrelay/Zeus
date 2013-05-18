utils = require './utils'
ConfigSetting = require './configsetting'

module.exports = class ZeusService
	constructor: (@type, @config) ->

	@revive: (obj) ->
		new ZeusService obj.type, utils.mapObject(obj.config, ConfigSetting.revive)

	cryofreeze: ->
		type: @type,
		config: utils.mapObject @config, ConfigSetting.prototype.cryofreeze