module.exports = (keyProperty, itemReviver = ((i) -> i)) -> 
	class KeyedList
		constructor: (initialItems = []) ->
			_rawtable = {}

			count = initialItems.length;
			for item in initialItems
				if not item.hasOwnProperty keyProperty
					throw new Error "Provided value has no '" + keyProperty + "' property"
				key = item[keyProperty]
				_rawtable[key] = item

			Object.defineProperty(@, 'length', 
				configurable: false,
				enumerable: false,
				get: -> count)

			@get = (key) ->
				_rawtable[key]
			@add = (value) ->
				if not value.hasOwnProperty keyProperty
					throw new Error "Provided value has no '" + keyProperty + "' property"
				key = value[keyProperty]
				if @has key
					throw new Error 'There is already an item with the key: ' + key
				_rawtable[key] = value
				count++;
			@has = (key) ->
				_rawtable.hasOwnProperty key
			@hasnt = (key) -> not @has key

			@delete = (key) ->
				if not @has key
					throw new Error 'There is no item with key: ' + key
				delete _rawtable[key]
				count--;

			@keys = -> key for own key of _rawtable
			@values = -> _rawtable[key] for own key of _rawtable

			@cryofreeze = ->
				# Return the table, but freeze the objects within
				result = {}
				for own key of _rawtable
					frozen = _rawtable[key].cryofreeze()
					if frozen.hasOwnProperty keyProperty
						delete frozen[keyProperty]
					result[key] = frozen
				return result

		@revive: (frozenTable) ->
			new KeyedList (for own key of frozenTable
				frozen = frozenTable[key]
				frozen[keyProperty] = key
				itemReviver frozen)