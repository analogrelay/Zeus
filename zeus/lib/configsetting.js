function ConfigSetting(name, template, required) {
	if(typeof template === 'boolean') {
		required = template;
		template = '';
	}

	this.name = name || '';
	this.template = template || '';
	this.required = required || true;
}

/** Loads a true ConfigSetting object out of a plain JS object with matching properties */
ConfigSetting.revive = function(name, obj) {
	return new ConfigSetting(name, obj.template, obj.required);
};

/** Returns a copy of the object designed for cleaner JSON serialization */
ConfigSetting.prototype.cryo = function() {
	var frozen = {};
	var isNull = true;
	if(!this.template && this.required) {
		return null;
	} else {
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