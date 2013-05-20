utils = apprequire 'utils'

sinon.assert.expose assert, {prefix: ''}

describe 'utils', ->
	describe '#mapObject', ->
		obj = 
			foo: 42, 
			bar: 24

		it 'should return undefined if no arguments passed', ->
			assert.isUndefined utils.mapObject()
		
		it 'should return the same object if no filter method provided', ->
			assert.equal utils.mapObject(obj), obj
		
		it 'should execute the callback for each key, using the value as the context', ->
			# Arrange
			spy = sinon.spy()
			
			# Act
			utils.mapObject obj, spy

			# Assert
			assert.calledWith spy, 42, 'foo', obj
			assert.calledOn spy, 42

			assert.calledWith spy, 24, 'bar', obj
			assert.calledOn spy, 24
		
		it 'should execute the callback, using the specified context, for each key', ->
			# Arrange
			ctxt = {}
			spy = sinon.spy()
			
			# Act
			utils.mapObject obj, spy, ctxt

			# Assert
			assert.calledWith spy, 42, 'foo', obj
			assert.calledWith spy, 24, 'bar', obj
			assert.alwaysCalledOn spy, ctxt
		
		it 'should put the result of the callback in the matching key', ->
			assert.deepEqual utils.mapObject(obj, (value) -> value * 10),
				foo: 420, 
				bar: 240