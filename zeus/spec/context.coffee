libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
fs = require 'fs'
ui = require(libpath + '/ui').empty

describe 'Context', ->
	zeus = require libpath + '/zeus'

	zf = new zeus.Zeusfile 'test'
	expectedString = JSON.stringify {name: "test", services: {}}, null, 2
	sandbox = null
	beforeEach ->
		sandbox = sinon.sandbox.create()

		# Stub out functions
		sandbox.stub fs, 'writeFile'
		sandbox.stub fs, 'readdir'
		sandbox.stub ui.log, 'warn'
	
	afterEach ->
		# Clean up the sandbox
		sandbox.restore()

	describe '#save', ->
		it 'should pass through errors from FS module', (done) ->
			# Arrange
			context = new zeus.Context zf, 'this/aint/real'
			expected = new Error 'Ruh roh!'
			fs.writeFile.yields expected

			# Act
			context.save (actual) ->
				assert.equal expected, actual
				done()

		it 'should produce no error if successful', (done) ->
			# Arrange
			context = new zeus.Context zf, 'this/aint/real'
			fs.writeFile.yields false

			# Act
			context.save (err) ->
				assert.ifError err
				assert.ok fs.writeFile.called
				assert.equal fs.writeFile.getCall(0).args[0], 'this/aint/real'
				assert.equal fs.writeFile.getCall(0).args[1], expectedString
				done()

		it 'should warn if there are issues when saving', (done) ->
			# Arrange
			context = new zeus.Context zf, 'this/aint/real'
			fs.writeFile.yields false

			# Act
			context.save (err) ->
				assert.ifError err
				assert.ok fs.writeFile.called
				assert.equal fs.writeFile.getCall(0).args[0], 'this/aint/real'
				assert.equal fs.writeFile.getCall(0).args[1], expectedString
				done()

		it 'should log warning if service has issues', (done) ->
			# Arrange
			zeusfile = new zeus.Zeusfile 'test', {
				foo: new zeus.ZeusService('Not.A.Thing', {}),
				bar: new zeus.ZeusService('Whats.This', {}),
				baz: new zeus.ZeusService('Azure.Thing', {})
			}
			context = new zeus.Context(zeusfile, 'path', ui)
			context.plugins['Azure'] = {}
			fs.writeFile.yields()

			# Act
			results = context.save (err, callback) ->
				assert.ok ui.log.warn.calledWith "plugin for 'Not' could not be found"
				assert.ok ui.log.warn.calledWith " you will not be able to work with the 'foo' service"
				assert.ok ui.log.warn.calledWith "plugin for 'Whats' could not be found"
				assert.ok ui.log.warn.calledWith " you will not be able to work with the 'bar' service"
				done()

	describe '#loadPlugins', ->
		it 'should pass through errors from FS module', (done) ->
			# Arrange
			context = new zeus.Context zf, 'this/aint/real'
			expected = new Error 'Ruh roh!'
			fs.readdir.yields expected

			# Act
			context.loadPlugins 'myplugindir', (actual) ->
				assert.equal(expected, actual)
				done()

		it 'should require each js file it finds', (done) ->
			# Arrange
			context = new zeus.Context zf, 'this/aint/real'
			expected = new Error 'Ruh roh!'
			fs.readdir.yields null, [
				'foo.js',
				'bar.js',
				'baz.ts'
			]

			# Act
			sandbox.stub context, 'loadPlugin'
			context.loadPlugins 'myplugindir', (err) ->
				assert.ifError err
				assert.ok context.loadPlugin.calledWith 'myplugindir\\foo.js'
				assert.ok context.loadPlugin.calledWith 'myplugindir\\bar.js'
				assert.isFalse context.loadPlugin.calledWith 'myplugindir\\baz.ts'
				done()

		it 'should use the plugins directory beside the context.js file if no directory specfied', (done) ->
			# Arrange
			context = new zeus.Context zf, 'this/aint/real'
			expected = new Error 'Ruh roh!'
			fs.readdir.yields null, [
				'foo.js',
				'bar.js',
				'baz.ts'
			]

			# Act
			sandbox.stub context, 'loadPlugin'
			context.loadPlugins (err) ->
				assert.ifError err
				root = path.normalize path.join __dirname, libpath
				assert.ok context.loadPlugin.calledWith root + '\\plugins\\foo.js'
				assert.ok context.loadPlugin.calledWith root + '\\plugins\\bar.js'
				assert.isFalse context.loadPlugin.calledWith root + '\\plugins\\baz.ts'
				done()

	describe '#check', ->
		it 'should return error for each service without a plugin', ->
			# Arrange
			zeusfile = new zeus.Zeusfile 'test', {
				foo: new zeus.ZeusService('Not.A.Thing', {}),
				bar: new zeus.ZeusService('Whats.This', {}),
				baz: new zeus.ZeusService('Azure.Thing', {})
			}
			context = new zeus.Context zeusfile, 'path'
			context.plugins['Azure'] = {}

			# Act
			results = context.check()

			# Assert
			assert.deepEqual results, [
				{ type: 'missing_plugin', name: 'Not', service: 'foo' },
				{ type: 'missing_plugin', name: 'Whats', service: 'bar' }
			]

	# describe('#createServiceInstance', ->
	# 	it 'should yield error if plugin not available', (done) ->
	# 		# Arrange
	# 		zeusfile = new zeus.Zeusfile('test', {
	# 			foo: new zeus.ZeusService('Not.A.Thing', {})
	# 		})
	# 		context = new zeus.Context(zeusfile, 'path')

	# 		# Act
	# 		context.createServiceInstance({}, 'foo', zeusfile.services.foo, (err) ->
	# 			assert.deepEqual(err, new Error('no plugin for service type: Not.A.Thing'))
	# 			done()
	# 		})
	# 	})

	# 	it 'should pass through to plugin if available', (done) ->
	# 		# Arrange
	# 		zeusfile = new zeus.Zeusfile('test', {
	# 			foo: new zeus.ZeusService('Azure.Thing', {})
	# 		})
	# 		context = new zeus.Context(zeusfile, 'path')
	# 		context.plugins['Azure.Thing'] = {
	# 			createServiceInstance: sinon.stub()
	# 		}
	# 		context.plugins['Azure.Thing'].createServiceInstance.yields()

	# 		# Act
	# 		env = {}
	# 		context.createServiceInstance(env, 'foo', zeusfile.services.foo, (err) ->
	# 			assert.ifError(err)
	# 			assert.ok(context.plugins['Azure.Thing'].createServiceInstance.calledWith(env, 'foo', zeusfile.services.foo, sinon.match.any))
	# 			done()
	# 		})
	# 	})
	# })