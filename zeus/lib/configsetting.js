function ConfigSetting(template, required) {
	if(typeof template === 'boolean') {
		required = template;
		template = '';
	} else if(typeof required === 'undefined') {
		required = true;
	}

	this.template = template || '';
	this.required = required;
}

/** Loads a true ConfigSetting object out of a plain JS object with matching properties */
ConfigSetting.fromJSON = function(value) {
	if(!value) {
		return new ConfigSetting('', true);
	} else if(typeof value === 'string') {
		return new ConfigSetting(value, true);
	} else {
		return new ConfigSetting(value.template, value.required);
	}
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ConfigSetting.toJSON = function(value) {
	if(!value.template && value.required) {
		return null;
	} else if(value.template && value.required) {
		return value.template;
	} else {
		var json = {};
		if(value.template) {
			json.template = value.template;
		}
		if(!value.required) {
			json.required = false;
		}
		return json;
	}
};
exports = module.exports = ConfigSetting;