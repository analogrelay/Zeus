function KeyedCollection(keySelector, extensible) {
	if(!keySelector) {
		throw new Error("The 'keySelector' parameter must be specified");
	}

	var table = {};

	function pushOrSet(allowReplacement) {
		return function(value) {
			var key;
			if(!value) { throw new Error("The 'value' parameter must be specified"); }

			key = keySelector(value);
			if(!key) { throw new Error("The key for this object is undefined"); }

			if(!allowReplacement && table.hasOwnProperty(key)) { 
				throw new Error("The key '" + key + "' already exists in the collection. Use the 'set' method to replace it."); 
			}
			table[key] = value;
		};
	}

	this.push = pushOrSet(false);
	this.set = pushOrSet(true);

	this.get = function(key) {
		return table[key];
	};

	this.has = function(key) {
		return table.hasOwnProperty(key);
	};

	this.keys = function() { return Object.keys(table); };

	if(!extensible) {
		Object.freeze(this);
	}
}
module.exports = exports = KeyedCollection;