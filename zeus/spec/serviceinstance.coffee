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