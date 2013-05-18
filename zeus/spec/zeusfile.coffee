libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
Zeusfile = require libpath + '/zeusfile.js'
ZeusService = require libpath + '/zeusservice.js'

describe 'Zeusfile', ->
	describe '#constructor', ->
		it 'should initialize services', ->
			assert.isNotNull new Zeusfile('foo').services

		it 'should initialize name', ->
			assert.equal new Zeusfile('foo').name, 'foo'

	describe '#cryofreeze', ->
		it 'should cryo-freeze a simple Zeusfile', ->
			zf = new Zeusfile 'app'
			zf.services.foo = new ZeusService 'bar'
			
			assert.deepEqual zf.cryofreeze(), 
				name: 'app',
				services:
					foo:
						type: 'bar', 
						config:{}

	describe '.revive', ->
		it 'should load the name and empty services from name only', ->
			zf = Zeusfile.revive {name: 'app'}
			
			assert.instanceOf zf, Zeusfile
			assert.equal zf.name, 'app'
			assert.isNotNull zf.services
		
		it 'should revive services', ->
			zf = Zeusfile.revive
				name: 'app', 
				services: 
					'foo': 
						type: 'bar'
			
			assert.instanceOf zf, Zeusfile
			assert.equal zf.name, 'app'
			assert.isNotNull zf.services
			assert.isDefined zf.services.foo
			assert.instanceOf zf.services.foo, ZeusService
			assert.equal zf.services.foo.type, 'bar'