cryo = require './cryo'

module.exports = (keyProperty, ItemConstructor = Object) ->
	class KeyedList
		constructor: (initialItems = []) ->
			@_rawtable = {}

			@_count = initialItems.length;
			for item in initialItems
				if not item.hasOwnProperty keyProperty
					throw new Error "Provided value has no '" + keyProperty + "' property"
				key = item[keyProperty]
				@_rawtable[key] = item

			Object.defineProperty(@, 'length', 
				configurable: false,
				enumerable: false,
				get: -> @_count)

		get: (key) ->
			@_rawtable[key]
		add: (value) ->
			if not value.hasOwnProperty keyProperty
				throw new Error "Provided value has no '" + keyProperty + "' property"
			key = value[keyProperty]
			if @has key
				throw new Error 'There is already an item with the key: ' + key
			@_rawtable[key] = value
			@_count++;
		has: (key) ->
			@_rawtable.hasOwnProperty key
		hasnt: (key) -> not @has key

		delete: (key) ->
			if not @has key
				throw new Error 'There is no item with key: ' + key
			delete @_rawtable[key]
			@_count--;

		keys: -> key for own key of @_rawtable
		values: -> @_rawtable[key] for own key of @_rawtable

		@$cryo:
			$freeze: (self) ->
				# Return the table, but freeze the objects within
				result = {}
				for own key of self._rawtable
					frozen = cryo.freeze self._rawtable[key]
					if frozen.hasOwnProperty keyProperty
						delete frozen[keyProperty]
					result[key] = frozen
				return result

			$revive: (frozenTable) ->
				new KeyedList (for own key of frozenTable
					frozen = frozenTable[key]
					frozen[keyProperty] = key
					cryo.revive frozen, ItemConstructor)