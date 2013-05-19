module.exports = exports = CryoFreezer = {}

CryoFreezer.freeze = (obj, options = {}) ->
	if not obj? then return obj

	options = obj.$cryo || obj.constructor.$cryo || {}
	if options.$freeze
		options.$freeze obj
	else
		switch typeof obj
			when 'function' then return
			when 'string','number','boolean' then obj
			else
				if not obj? then return obj
				
				if obj instanceof Array
					CryoFreezer.freeze elem for elem in obj
				else
					result = {}
					result[key] = CryoFreezer.freeze obj[key] for own key of obj
					return result
CryoFreezer.revive = (obj, Constructor = Object) ->
	options = Constructor.$cryo || {}
	if options.$revive
		options.$revive obj
	else
		switch typeof obj
			when 'function' then return
			when 'string','number','boolean' then obj
			else
				if not obj? then return obj
				
				if obj instanceof Array
					CryoFreezer.revive elem for elem in obj
				else
					# Create the target object
					target = new Constructor

					# Copy keys
					for own key of obj
						# Check for a property annotation
						if typeof options[key] is 'function'
							# We've got one, use it to revive the object
							target[key] = CryoFreezer.revive obj[key], options[key]
						else
							# Nope, just load the key
							target[key] = obj[key] 

					# Return
					return target