path = require 'path'

ServiceInstance = apprequire 'serviceinstance'

describe 'ServiceInstance', ->
	describe '#constructor', ->
		it 'should accept (string, string, object)', ->
			config = {}
			instance = new ServiceInstance 'foo', 'bar', config

			assert.strictEqual instance.name, 'foo'
			assert.strictEqual instance.serviceName, 'bar'
			assert.strictEqual instance.config, config
		
		it 'should accept (string, string)', ->
			instance = new ServiceInstance 'foo', 'bar'

			assert.strictEqual instance.name, 'foo'
			assert.strictEqual instance.serviceName, 'bar'
			assert.isNotNull instance.config