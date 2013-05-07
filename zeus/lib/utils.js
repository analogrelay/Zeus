exports.mapObject = function mapObject(object, callback, context) {
	if(!callback) {
		return object;
	}

	var result = {};
	Object.keys(object).forEach(function(key) {
		result[key] = callback.call(context, object[key], key, object);
	});
	return result;
};