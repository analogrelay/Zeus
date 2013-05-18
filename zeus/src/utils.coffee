exports.mapObject = mapObject = (object, callback, context) ->
	return object unless callback? and object?
	
	result = {}
	result[key] = (callback.call context || value, value, key, object) for key in Object.keys(object)
	return result