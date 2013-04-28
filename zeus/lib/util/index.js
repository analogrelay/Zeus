var _ = require('underscore');

function toObject(collection, keyPropertyName, valueSelector) {
		var obj = {};
		_.each(collection, function(element, index, list) {
			obj[element[keyPropertyName]] = valueSelector(element);
		});
		return obj;
}
exports.toObject = toObject;

module.exports = exports;