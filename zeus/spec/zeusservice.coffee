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