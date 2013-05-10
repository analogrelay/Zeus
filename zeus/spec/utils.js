var libpath = process.env['ZEUS_COV'] ? '../lib-cov' : '../lib'

var utils = require(libpath + '/utils'),
	sinon = require('sinon'),
	assert = require('chai').assert;

sinon.assert.expose(assert, {prefix: ''});

describe('the utils module', function() {
	describe('the mapObject method', function() {
		var obj = {foo: 42, bar: 24};
		it('should return undefined if no arguments passed', function() {
			assert.isUndefined(utils.mapObject());
		});
		it('should return the same object if no filter method provided', function() {
			assert.equal(utils.mapObject(obj), obj);
		});
		it('should execute the callback for each key, using the value as the context', function() {
			// Arrange
			var spy = sinon.spy();
			
			// Act
			utils.mapObject(obj, spy);

			// Assert
			assert.calledWith(spy, 42, 'foo', obj);
			assert.calledOn(spy, 42);

			assert.calledWith(spy, 24, 'bar', obj);
			assert.calledOn(spy, 24);
		});
		it('should execute the callback, using the specified context, for each key', function() {
			// Arrange
			var ctxt = {};
			var spy = sinon.spy();
			
			// Act
			utils.mapObject(obj, spy, ctxt);

			// Assert
			assert.calledWith(spy, 42, 'foo', obj);
			assert.calledWith(spy, 24, 'bar', obj);
			assert.alwaysCalledOn(spy, ctxt);
		});
		it('should put the result of the callback in the matching key', function() {
			assert.deepEqual(utils.mapObject(obj, function(value, key, list) {
				return value * 10;
			}), {foo: 420, bar: 240});
		})
	});
});