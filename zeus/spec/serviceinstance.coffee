libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
ServiceInstance = require libpath + '/serviceinstance'

describe 'ServiceInstance', ->
	describe '#constructor', ->
		it 'should accept (object)', ->
			config = {}
			instance = new ServiceInstance config

			assert.strictEqual config, instance.config
		
		it 'should accept ()', ->
			instance = new ServiceInstance()

			assert.isNotNull instance.config

	describe '.revive', ->
		it 'should return a true service instance', ->
			frozen =
				config:
					 'foo': 42

			expected = new ServiceInstance {foo: 42}
			revived = ServiceInstance.revive frozen

			assert.deepEqual revived, expected
			assert.instanceOf revived, ServiceInstance

	describe '#cryofreeze', ->
		it 'should return a frozen serviceinstance object', ->
			expected =
				config: 
					'foo': 42

			live = new ServiceInstance {foo: 42}
			frozen = live.cryofreeze()

			assert.deepEqual frozen, expected