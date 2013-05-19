utils = require './utils'

module.exports = class ConfigSetting
	constructor: (@name, template, required) ->
		if typeof template is 'boolean'
			@template = ''
			@required = template
		else
			if not required?
				@required = true
			else
				@required = required
			@template = template || ''

	@revive: (obj) ->
		if not obj?
			new ConfigSetting '', true
		else if typeof obj is 'string'
			new ConfigSetting obj, true
		else
			new ConfigSetting obj.template, obj.required

	cryofreeze: ->
		if !@template && @required
			null
		else if @template && @required
			@template
		else
			frozen = {}
			if @template
				frozen.template = @template
			if !@required
				frozen.required = false
			return frozen

	@List: utils.keyedListFor 'name', ConfigSetting