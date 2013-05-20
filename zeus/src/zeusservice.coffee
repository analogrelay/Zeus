utils = require './utils'
ConfigSetting = require './configsetting'

module.exports = class ZeusService
	constructor: (@name, @type, config...) ->
		@config = new ZeusService.List(config)

	@$cryo: config: ConfigSetting.List
	@List: utils.keyedListFor 'name', ZeusService