libpath = if process.env['ZEUS_COV'] then '../../lib-cov' else '../../lib'

utils = require libpath + '/utils'
cryo = require libpath + '/utils/cryo'
sinon = require 'sinon'
assert = require('chai').assert;

class Widget
	constructor: (@name, @flarbRatio) ->

	@$cryo:
		$freeze: (self) ->
			name: self.name
			flarbRatio: self.flarbRatio * 10
		$revive: (frozen) -> new Widget(frozen.name, frozen.flarbRatio / 10)
	
	@List: utils.keyedListFor 'name', Widget

describe 'Widget.List', ->
	describe '#constructor', ->
		it 'should accept ()', ->
			list = new Widget.List

			assert.equal list.length, 0

		it 'should throw if given (array) where at least one item has invalid structure', ->
			assert.throws (-> new Widget.List [{a: 1, b: 2, c: 3}]), "Provided value has no 'name' property"

		it 'should accept (array)', ->
			a = new Widget('a', 1.0)
			b = new Widget('b', 2.0)
			list = new Widget.List [a,b]

			assert.equal list.length, 2
			assert.ok list.has 'a'
			assert.equal list.get('a'), a
			assert.ok list.has 'b'
			assert.equal list.get('b'), b

	describe '#add', ->
		it 'should throw if key property not found on object', ->
			list = new Widget.List
			assert.throws (-> list.add {foo:42}), "Provided value has no 'name' property"

		it 'should throw if item with same key value exists', ->
			list = new Widget.List [new Widget 'foo']
			assert.throws (-> list.add new Widget 'foo'), "There is already an item with the key: foo"

		it 'should increase the length', ->
			list = new Widget.List

			list.add new Widget 'foo', 42.0
			assert.equal list.length, 1

			list.add new Widget 'bar', 24.0
			assert.equal list.length, 2

		it 'should make has(key) succeed', ->
			list = new Widget.List
			assert.ok list.hasnt 'a'
			list.add new Widget 'a', 42.0
			assert.ok list.has 'a'

		it 'should make get(key) return the added value', ->
			list = new Widget.List
			a = new Widget 'a', 42.0
			list.add a
			assert.strictEqual list.get('a'), a

	describe '#delete', ->
		it 'should throw if no item with specified key value exists', ->
			list = new Widget.List
			assert.throws (-> list.delete 'foo'), "There is no item with key: foo"

		it 'should decrease the length', ->
			list = new Widget.List [
				new Widget('foo', 42.0),
				new Widget('bar', 24.0)
			]

			assert.equal list.length, 2

			list.delete 'foo'
			assert.equal list.length, 1

			list.delete 'bar'
			assert.equal list.length, 0

		it 'should make hasnt(key) succeed', ->
			list = new Widget.List [new Widget('a', 42.0)]
			assert.ok list.has 'a'
			list.delete 'a'
			assert.ok list.hasnt 'a'

		it 'should make get(key) return undefined', ->
			list = new Widget.List [new Widget 'a', 42.0]
			list.delete 'a'
			assert.isUndefined list.get('a')

	describe '#has', ->
		it 'should return false if key does not exist', ->
			list = new Widget.List
			assert.strictEqual list.has('a'), false

		it 'should return true if key does exist', ->
			list = new Widget.List [new Widget 'a', 42.0]
			assert.strictEqual list.has('a'), true

	describe '#hasnt', ->
		it 'should return true if key does not exist', ->
			list = new Widget.List
			assert.strictEqual list.hasnt('a'), true

		it 'should return false if key does exist', ->
			list = new Widget.List [new Widget 'a', 42.0]
			assert.strictEqual list.hasnt('a'), false

	describe '#keys', ->
		it 'should return empty array if list empty', ->
			list = new Widget.List
			assert.deepEqual list.keys(), []

		it 'should return current set of keys if list non-empty', ->
			list = new Widget.List
			list.add new Widget 'a', 1.0
			list.add new Widget 'b', 2.0
			list.add new Widget 'c', 3.0
			list.delete 'b'
			assert.deepEqual list.keys(), ['a', 'c']

	describe '#values', ->
		it 'should return empty array if list empty', ->
			list = new Widget.List
			assert.deepEqual list.values(), []

		it 'should return current set of values if list non-empty', ->
			list = new Widget.List
			a = new Widget 'a', 1.0
			b = new Widget 'b', 2.0
			c = new Widget 'c', 3.0
			list.add a
			list.add b
			list.add c
			list.delete 'b'
			assert.deepEqual list.values(), [a, c]

	describe 'cryo.freeze', ->
		it 'should return empty object if list empty', ->
			list = new Widget.List
			assert.deepEqual cryo.freeze(list), {}

		it 'should return map with name properties removed from values if list non-empty', ->
			list = new Widget.List [
				new Widget('a', 1.0),
				new Widget('b', 2.0)
			]
			assert.deepEqual cryo.freeze(list),
				a: {flarbRatio: 10.0},
				b: {flarbRatio: 20.0}

	describe 'cryo.revive', ->
		it 'should return empty list if frozen object empty', ->
			list = cryo.revive({}, Widget.List)
			assert.equal list.length, 0

		it 'should return revived list if frozen object has values', ->
			list = cryo.revive({'foo': {flarbRatio: 420.0}}, Widget.List)
			assert.equal list.length, 1
			assert.ok list.has 'foo'
			assert.equal list.get('foo').flarbRatio, 42.0

		it 'should restore key property to revived objects', ->
			list = cryo.revive({'foo': {flarbRatio: 420.0}}, Widget.List)
			assert.equal list.get('foo').name, 'foo'