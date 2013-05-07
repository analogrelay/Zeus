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
ConfigSetting.revive = function(obj) {
	if(!obj) {
		return new ConfigSetting('', true);
	} else if(typeof obj === 'string') {
		return new ConfigSetting(obj, true);
	} else {
		return new ConfigSetting(obj.template, obj.required);
	}
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ConfigSetting.prototype.cryofreeze = function() {
	if(!this.template && this.required) {
		return null;
	} else if(this.template && this.required) {
		return this.template;
	} else {
		var frozen = {};
		if(this.template) {
			frozen.template = this.template;
		}
		if(!this.required) {
			frozen.required = false;
		}
		return frozen;
	}
};
exports = module.exports = ConfigSetting;