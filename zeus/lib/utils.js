function mapObject(object, callback, context) {
    if (!callback) {
        return object;
    }
    if (!object) {
        return object;
    }
    var result = {};
    Object.keys(object).forEach(function (key) {
        var value = object[key];
        result[key] = callback.call(context || value, value, key, object);
    });
    return result;
}
exports.mapObject = mapObject;
;
//@ sourceMappingURL=utils.js.map
