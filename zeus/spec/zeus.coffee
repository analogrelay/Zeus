libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'

describe '#context(dir, appname)', ->
	root = 'root'
	sub = path.join root, 'sub'
	subsub = path.join sub, 'subsub'

	ui = require(libpath + '/ui').empty
	fs = require 'fs'
	zeus = require libpath + '/zeus'
	sandbox = null
	
	beforeEach ->
		sandbox = sinon.sandbox.create();

		# Stub out functions
		sandbox.stub fs, 'exists'
		sandbox.stub fs, 'readFile'
		sandbox.stub zeus.Context.prototype, 'loadPlugin'

	afterEach ->
		# Clean up the sandbox
		sandbox.restore()

	it 'should throw if zeus context already exists', (done) ->
		# Arrange
		fs
			.exists
			.withArgs(path.join('mydir', 'Zeusfile'), sinon.match.func)
			.yields(true)
		
		# Act/Assert
		zeus.context ui, 'mydir', 'newapp', (err, context) ->
			assert.equal err.message, "Can't create a new Zeusfile. There is already one in this directory"
			done()
	
	it 'should return context with Zeusfile path if no file exists', (done) ->
		# Arrange
		fs
			.exists
			.withArgs(path.join('mydir', 'Zeusfile'), sinon.match.func)
			.yields(false);

		# Act
		zeus.context ui, 'mydir', 'myApp', (err, context) ->
			# Assert
			assert.ifError err
			assert.equal context.path, path.join('mydir', 'Zeusfile')
			assert.equal context.zeusfile.name, 'myApp'
			done()
	
	it 'should throw if no app name provides and no Zeusfile found', (done) ->
		# Arrange
		fs
			.exists
			.yields(false);
		
		# Act
		context = zeus.context ui, subsub, (err, context) ->
			assert.equal err.message, "No Zeusfile found!"
			done()

	it 'should load same-folder Zeusfile', (done) ->
		# Arrange
		zfpath = path.join subsub, 'Zeusfile'
		fs
			.exists
			.withArgs(zfpath, sinon.match.func)
			.yields(true)
		fs
			.readFile
			.withArgs(zfpath, sinon.match.func)
			.yields(null, "{ \"name\": \"the test app\" }")
		
		# Act
		zeus.context ui, subsub, (err, context) ->
			assert.ifError err
			assert.equal context.path, zfpath
			assert.equal context.zeusfile.name, 'the test app'
			done()

	it 'should load parent folder Zeusfile', (done) ->
		# Arrange
		zfpath = path.join sub, 'Zeusfile'
		fs
			.exists
			.withArgs(zfpath, sinon.match.func)
			.yields(true)
		fs
			.exists
			.withArgs(path.join(subsub, 'Zeusfile'), sinon.match.func)
			.yields(false)
		fs
			.readFile
			.withArgs(zfpath, sinon.match.func)
			.yields(null, "{ \"name\": \"the test app\" }")
		
		# Act
		zeus.context ui, subsub, (err, context) ->
			assert.ifError err
			assert.equal context.path, zfpath
			assert.equal context.zeusfile.name, 'the test app'
			done()

	it 'should load grandparent folder Zeusfile', (done) ->
		# Arrange
		zfpath = path.join root, 'Zeusfile'
		fs
			.exists
			.withArgs(zfpath, sinon.match.func)
			.yields(true)
		fs
			.exists
			.withArgs(path.join(subsub, 'Zeusfile'), sinon.match.func)
			.yields(false)
		fs
			.exists
			.withArgs(path.join(sub, 'Zeusfile'), sinon.match.func)
			.yields(false)
		fs
			.readFile
			.withArgs(zfpath, sinon.match.func)
			.yields(null, "{ \"name\": \"the test app\" }")
		
		# Act
		zeus.context ui, subsub, (err, context) ->
			assert.ifError err
			assert.equal context.path, zfpath
			assert.equal context.zeusfile.name, 'the test app'
			done()