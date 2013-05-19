utils = require './utils'

module.exports = class ConfigSetting
	constructor: (name, template, required) ->
		if not required?
			required = true
		if typeof template is 'boolean'
			template = ''
			required = template

		@name = name || ''
		@template = template || ''
		@required = !!required

	# static annotations
	@List: utils.keyedListFor 'name', ConfigSetting
	@$cryo:
		$revive: (obj) ->
			if not obj?
				new ConfigSetting undefined, '', true
			else if typeof obj is 'string'
				new ConfigSetting undefined, obj, true
			else
				new ConfigSetting undefined, obj.template, obj.required

		$freeze: (obj) ->
			if !obj.template && obj.required
				null
			else if obj.template && obj.required
				obj.template
			else
				frozen = {}
				if obj.template
					frozen.template = obj.template
				if !obj.required
					frozen.required = false
				return frozen
