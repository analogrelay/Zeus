exports.mapObject = mapObject = (object, callback, context) ->
	return object unless callback? and object?
	
	result = {}
	result[key] = (callback.call context || object[key], object[key], key, object) for key in Object.keys(object)
	return result