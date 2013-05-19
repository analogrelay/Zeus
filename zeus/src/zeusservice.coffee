utils = require './utils'
ConfigSetting = require './configsetting'

module.exports = class ZeusService
	constructor: (@type, @config = {}) ->

	@$cryo: config: ConfigSetting.List