libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
ZeusService = require libpath + '/zeusservice.js'
ConfigSetting = require libpath + '/configsetting.js'

describe 'ZeusService', ->
	describe '#constructor', ->
		it 'should initialize config', ->
			assert.isNotNull new ZeusService('foo').config
		
		it 'should initialize type', ->
			assert.equal new ZeusService('foo').type, 'foo'
		
	
	describe '#cryofreeze', ->
		it 'should cryo-freeze a simple ZeusService', ->
			service = new ZeusService 'thingy'
			service.config.foo = new ConfigSetting '{{bar}}', false
			
			assert.deepEqual service.cryofreeze(),
				type: 'thingy', 
				config:
					foo: 
						template: '{{bar}}', 
						required: false

	describe '.revive', ->
		it 'should load the type and empty config from type only', ->
			service = ZeusService.revive { type: 'app' }
			
			assert.instanceOf service, ZeusService
			assert.equal service.type, 'app'
			assert.isNotNull service.config
		
		it 'should revive services', ->
			service = ZeusService.revive
				type: 'app', 
				config: 
					foo: 
						template: '{{bar}}',
						required: false
			
			assert.instanceOf service, ZeusService
			assert.equal service.type, 'app'
			assert.isNotNull service.config
			assert.isDefined service.config.foo
			assert.instanceOf service.config.foo, ConfigSetting
			assert.equal service.config.foo.template, '{{bar}}'
			assert.isFalse service.config.foo.required
		
	
