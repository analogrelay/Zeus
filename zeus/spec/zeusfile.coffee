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