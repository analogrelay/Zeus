class ConfigSetting
	constructor: (template, required) ->
		if typeof template is 'boolean'
			@template = ''
			@required = template
		else
			@template = template
			@required = required

	@revive: (obj) ->
		if !obj
			new ConfigSetting('', true)
		else if typeof obj is 'string'
			new ConfigSetting(obj, true)
		else
			new ConfigSetting(obj.template, obj.required)

	cryofreeze: () ->
		if !@template && @required
			null
		else if @template && @required
			@template
		else
			frozen = {}
			if @template
				frozen.template = @template
			if !@required
				frozen.required = false;
			return frozen;

exports = module.exports = ConfigSetting;