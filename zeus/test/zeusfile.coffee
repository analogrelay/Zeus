path = require 'path'

Zeusfile = apprequire 'zeusfile.js'
ZeusService = apprequire 'zeusservice.js'

describe 'Zeusfile', ->
	describe '#constructor', ->
		it 'should initialize services', ->
			assert.isNotNull new Zeusfile('foo').services

		it 'should initialize name', ->
			assert.equal new Zeusfile('foo').name, 'foo'