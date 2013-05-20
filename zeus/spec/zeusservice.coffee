path = require 'path'

ZeusService = apprequire 'zeusservice.js'
ConfigSetting = apprequire 'configsetting.js'

describe 'ZeusService', ->
	describe '#constructor', ->
		it 'should initialize config', ->
			assert.isNotNull new ZeusService('foo', 'bar').config
		
		it 'should initialize name', ->
			assert.equal new ZeusService('foo', 'bar').name, 'foo'

		it 'should initialize type', ->
			assert.equal new ZeusService('foo', 'bar').type, 'bar'