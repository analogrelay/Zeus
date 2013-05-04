var KeyedCollection = require('../lib/keyedcollection'),
	assert = require('chai').assert;

function TestObject(name, value) {
	this.name = name;
	this.value = value;
}
var testSelector = function(o) { return o.name };

describe('The KeyedCollection class', function() {
	describe('#constructor', function() {
		it('should throw if keySelector is undefined', function() {
			assert.throws(function() {
				new KeyedCollection();
			}, "The 'keySelector' parameter must be specified");
		});
	});
	describe('#push(value)', function() {
		it('should throw if value is undefined', function() {
			assert.throws(function() {
				new KeyedCollection(testSelector).push();
			}, "The 'value' parameter must be specified");
		});
		it('should throw if key is undefined', function() {
			assert.throws(function() {
				new KeyedCollection(testSelector).push({value: 42});
			}, "The key for this object is undefined");
		});
		it('should add value to table if key is defined and not present', function() {
			// Arrange
			var coll = new KeyedCollection(testSelector);
			var obj = new TestObject('foo', 42);
			coll.push(obj);

			// Act
			var actual = coll.get('foo');

			// Assert
			assert.strictEqual(actual, obj);
		});
		it('should throw if key already defined', function() {
			// Arrange
			var coll = new KeyedCollection(testSelector);
			var obj = new TestObject('foo', 42);
			coll.push(obj);

			// Act/Assert
			assert.throws(function() {
				coll.push(new TestObject('foo', 24));
			}, "The key 'foo' already exists in the collection. Use the 'set' method to replace it.");
		});
	});
	describe('#set(value)', function() {
		it('should throw if value is undefined', function() {
			assert.throws(function() {
				new KeyedCollection(testSelector).set();
			}, "The 'value' parameter must be specified");
		});
		it('should throw if key is undefined', function() {
			assert.throws(function() {
				new KeyedCollection(testSelector).set({value: 42});
			}, "The key for this object is undefined");
		});
		it('should add value to table if key is defined and not present', function() {
			// Arrange
			var coll = new KeyedCollection(testSelector);
			var obj = new TestObject('foo', 42);
			coll.set(obj);

			// Act
			var actual = coll.get('foo');

			// Assert
			assert.strictEqual(actual, obj);
		});
		it('should replace the value if the key already defined', function() {
			// Arrange
			var coll = new KeyedCollection(testSelector);
			var obj = new TestObject('foo', 24);
			coll.push(new TestObject('foo', 42));
			coll.set(obj);

			// Act
			var actual = coll.get('foo');

			// Assert
			assert.strictEqual(actual, obj);
		});
	});
	describe('#has(key)', function() {
		it("should return 'false' if key is not present", function() {
			assert.strictEqual(new KeyedCollection(testSelector).has('foo'), false);
		});
		it("should return 'true' if key is not present", function() {
			var coll = new KeyedCollection(testSelector);
			coll.push(new TestObject('foo', 42));
			assert.strictEqual(coll.has('foo'), true);
		});
	});
	describe('#keys()', function() {
		it("should return array of keys in table", function() {
			// Arrange
			var coll = new KeyedCollection(testSelector);
			coll.push(new TestObject('foo', 42));
			coll.push(new TestObject('bar', 24));

			// Act
			var actual = coll.keys();

			// Assert
			assert.deepEqual(actual, ['foo', 'bar']);
		})
	});

	it('should not allow extensions by default', function() {
		var coll = new KeyedCollection(testSelector);
		coll.foo = 'bar';
		coll.get = function(key) { return 'blargh'; }
		coll.push(new TestObject('foo', 42));
		assert.isUndefined(coll.foo);
		assert.notEqual(coll.get('foo'), 'blargh');
		assert.isTrue(Object.isFrozen(coll));
	});

	it('should allow extensions if extensible parameter is true', function() {
		var coll = new KeyedCollection(testSelector, true);
		coll.foo = 'bar';
		coll.get = function(key) { return 'blargh'; }
		coll.push(new TestObject('foo', 42));
		assert.strictEqual(coll.foo, 'bar');
		assert.strictEqual(coll.get('foo'), 'blargh');
		assert.isFalse(Object.isFrozen(coll));
	});
});