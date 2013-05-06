var _ = require('underscore');

_.mixin({
	mapObject: function(object, fn, context) {
		var result = {};
		Object.keys(object).forEach(function(key) {
			result[key] = fn.call(context, object[key], key, object);
		});
		return result;
	}
});

module.exports = exports = _;