libpath = if process.env['ZEUS_COV'] then '../../lib-cov' else '../../lib'

cryo = require libpath + '/utils/cryo'
sinon = require 'sinon'
assert = require('chai').assert;

class DumbObject
    constructor: (@foo, @bar) ->

class SelfFreezingObject
    constructor: (@name, @ratio) ->

    @$cryo:
        $freeze: (self) ->
            name: self.name
            ratio: self.ratio.toString()

        $revive: (frozen) -> 
            new SelfFreezingObject frozen.name, parseInt(frozen.ratio)

class Container
    constructor: (@normal, @child) ->

    @$cryo: child: SelfFreezingObject

describe 'cryo', ->
    describe '.freeze', ->
        it 'should pass string through', ->
            assert.strictEqual 'foo', cryo.freeze 'foo'

        it 'should pass number through', ->
            assert.strictEqual 3.14159, cryo.freeze 3.14159

        it 'should pass boolean through', ->
            assert.strictEqual true, cryo.freeze true

        it 'should pass null through', ->
            assert.isNull cryo.freeze null

        it 'should pass undefined through', ->
            assert.isUndefined cryo.freeze()

        it 'should return undefined for function input', ->
            assert.isUndefined cryo.freeze (->)

        it 'should return array for array of primitives', ->
            assert.deepEqual cryo.freeze([1,2,3]), [1,2,3]

        it 'should return object for object with primitive values', ->
            assert.deepEqual cryo.freeze({a: 1, b: 2}), {a: 1, b: 2}

        it 'should save simple class as prototype-less object', ->
            live = new DumbObject 'baz', 'boz'
            assert.instanceOf live, DumbObject

            frozen = cryo.freeze live
            assert.instanceOf frozen, Object
            assert.deepEqual frozen, {foo: 'baz', bar: 'boz'}

        it 'should run freezer if constructor has one', ->
            live = new SelfFreezingObject 'foo', 42
            frozen = cryo.freeze live
            assert.deepEqual frozen, {name: 'foo', ratio: '42'}

        it 'should run freezer for property', ->
            live = new Container 'foo', new SelfFreezingObject 'bar', 42
            frozen = cryo.freeze live
            assert.deepEqual frozen, {normal: 'foo', child: {name: 'bar', ratio: '42'}}

    describe '.revive', ->
        it 'should pass string through', ->
            assert.strictEqual 'foo', cryo.revive 'foo'

        it 'should pass number through', ->
            assert.strictEqual 3.14159, cryo.revive 3.14159

        it 'should pass boolean through', ->
            assert.strictEqual true, cryo.revive true

        it 'should pass null through', ->
            assert.isNull cryo.revive null

        it 'should pass undefined through', ->
            assert.isUndefined cryo.revive()

        it 'should return undefined for function input', ->
            assert.isUndefined cryo.revive (->)

        it 'should return array for array of primitives', ->
            assert.deepEqual cryo.revive([1,2,3]), [1,2,3]

        it 'should return object for object with primitive values', ->
            assert.deepEqual cryo.revive({a: 1, b: 2}), {a: 1, b: 2}

        it 'should revive simple class from prototype-less object', ->
            frozen = {foo: 'baz', bar: 'boz'}
            assert.instanceOf frozen, Object

            live = cryo.revive frozen, DumbObject
            assert.instanceOf live, DumbObject
            assert.deepEqual live, new DumbObject('baz', 'boz')

        it 'should run reviver if constructor has one', ->
            frozen = {name: 'foo', ratio: '42'}
            live = cryo.revive frozen, SelfFreezingObject
            assert.deepEqual live, new SelfFreezingObject 'foo', 42

        it 'should run reviver for property if constructor has property annotation', ->
            frozen = {normal: 'foo', child: {name: 'bar', ratio: '42'}}
            live = cryo.revive frozen, Container

            assert.instanceOf live, Container
            assert.instanceOf live.child, SelfFreezingObject
            assert.deepEqual live, new Container 'foo', new SelfFreezingObject 'bar', 42