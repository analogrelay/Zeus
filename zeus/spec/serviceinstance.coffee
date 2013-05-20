libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
ServiceInstance = require libpath + '/serviceinstance'

describe 'ServiceInstance', ->
	describe '#constructor', ->
		it 'should accept (string, object)', ->
			config = {}
			instance = new ServiceInstance 'foo', config

			assert.strictEqual instance.name, 'foo'
			assert.strictEqual instance.config, config
		
		it 'should accept (string)', ->
			instance = new ServiceInstance 'foo'

			assert.strictEqual instance.name, 'foo'
			assert.isNotNull instance.config