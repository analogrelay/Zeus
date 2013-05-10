var libpath = process.env['ZEUS_COV'] ? '../lib-cov' : '../lib'

var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon');

describe('Context', function() {
	var fs = require('fs');
	var zeus = require(libpath + '/zeus.js');
	var zf = new zeus.Zeusfile('test')
	var expectedString = JSON.stringify({name: "test", services: {}}, null, 2);
	var sandbox;
	var ui = {
		log: {
			warn: sinon.stub(),
			verbose: sinon.stub()
		}
	};
	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		// Stub out functions
		sandbox.stub(fs, 'writeFile');
		sandbox.stub(fs, 'readdir');
	});
	afterEach(function() {
		// Clean up the sandbox
		sandbox.restore();
	});

	describe('#save', function() {
		it('should pass through errors from FS module', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			var expected = new Error('Ruh roh!');
			fs.writeFile.yields(expected);

			// Act
			context.save(function(actual) {
				assert.equal(expected, actual);
				done();
			});
		});
		it('should produce falsey arg if successful', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			fs.writeFile.yields(false);

			// Act
			context.save(function(err) {
				assert.ifError(err);
				assert.ok(fs.writeFile.called);
				assert.equal(fs.writeFile.getCall(0).args[0], 'this/aint/real');
				assert.equal(fs.writeFile.getCall(0).args[1], expectedString);
				done();
			});
		});
		it('should warn if there are issues when saving', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			fs.writeFile.yields(false);

			// Act
			context.save(function(err) {
				assert.ifError(err);
				assert.ok(fs.writeFile.called);
				assert.equal(fs.writeFile.getCall(0).args[0], 'this/aint/real');
				assert.equal(fs.writeFile.getCall(0).args[1], expectedString);
				done();
			});
		});
		it('should log warning if service has issues', function(done) {
			// Arrange
			var zeusfile = new zeus.Zeusfile('test', {
				foo: new zeus.ZeusService('Not.A.Thing', {}),
				bar: new zeus.ZeusService('Whats.This', {}),
				baz: new zeus.ZeusService('Azure.Thing', {})
			});
			var context = new zeus.Context(zeusfile, 'path', ui);
			context.plugins['Azure.Thing'] = {};
			fs.writeFile.yields();

			// Act
			var results = context.save(function(err, callback) {
				assert.ok(ui.log.warn.calledWith("plugin for 'Not.A.Thing' could not be found"));
				assert.ok(ui.log.warn.calledWith(" you will not be able to work with the 'foo' service"));
				assert.ok(ui.log.warn.calledWith("plugin for 'Whats.This' could not be found"));
				assert.ok(ui.log.warn.calledWith(" you will not be able to work with the 'bar' service"));
				done();
			});
		});
	});

	describe('#loadPlugins', function() {
		it('should pass through errors from FS module', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			var expected = new Error('Ruh roh!');
			fs.readdir.yields(expected);

			// Act
			context.loadPlugins('myplugindir', function(actual) {
				assert.equal(expected, actual);
				done();
			});
		});

		it('should require each js file it finds', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			var expected = new Error('Ruh roh!');
			fs.readdir.yields(null, [
				'foo.js',
				'bar.js',
				'baz.ts'
			]);

			// Act
			sandbox.stub(context, 'loadPlugin');
			context.loadPlugins('myplugindir', function(err) {
				assert.ifError(err);
				assert.ok(context.loadPlugin.calledWith('myplugindir\\foo.js'));
				assert.ok(context.loadPlugin.calledWith('myplugindir\\bar.js'));
				assert.isFalse(context.loadPlugin.calledWith('myplugindir\\baz.ts'));
				done();
			});
		});

		it('should use the plugins directory beside the context.js file if no directory specfied', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			var expected = new Error('Ruh roh!');
			fs.readdir.yields(null, [
				'foo.js',
				'bar.js',
				'baz.ts'
			]);

			// Act
			sandbox.stub(context, 'loadPlugin');
			context.loadPlugins(function(err) {
				assert.ifError(err);
				var root = path.normalize(path.join(__dirname, libpath));
				assert.ok(context.loadPlugin.calledWith(root + '\\plugins\\foo.js'));
				assert.ok(context.loadPlugin.calledWith(root + '\\plugins\\bar.js'));
				assert.isFalse(context.loadPlugin.calledWith(root + '\\plugins\\baz.ts'));
				done();
			});
		});
	});

	describe('#check', function() {
		it('should return error for each service without a plugin', function() {
			// Arrange
			var zeusfile = new zeus.Zeusfile('test', {
				foo: new zeus.ZeusService('Not.A.Thing', {}),
				bar: new zeus.ZeusService('Whats.This', {}),
				baz: new zeus.ZeusService('Azure.Thing', {})
			});
			var context = new zeus.Context(zeusfile, 'path');
			context.plugins['Azure.Thing'] = {};

			// Act
			var results = context.check();

			// Assert
			assert.deepEqual(results, [
				{ type: 'missing_plugin', name: 'Not.A.Thing', service: 'foo' },
				{ type: 'missing_plugin', name: 'Whats.This', service: 'bar' }
			]);
		});
	});

	describe('#createServiceInstance', function() {
		it('should yield error if plugin not available', function(done) {
			// Arrange
			var zeusfile = new zeus.Zeusfile('test', {
				foo: new zeus.ZeusService('Not.A.Thing', {})
			});
			var context = new zeus.Context(zeusfile, 'path');

			// Act
			context.createServiceInstance({}, 'foo', zeusfile.services.foo, function(err) {
				assert.deepEqual(err, new Error('no plugin for service type: Not.A.Thing'));
				done();
			});
		});

		it('should pass through to plugin if available', function(done) {
			// Arrange
			var zeusfile = new zeus.Zeusfile('test', {
				foo: new zeus.ZeusService('Azure.Thing', {})
			});
			var context = new zeus.Context(zeusfile, 'path');
			context.plugins['Azure.Thing'] = {
				createServiceInstance: sinon.stub()
			};
			context.plugins['Azure.Thing'].createServiceInstance.yields();

			// Act
			var env = {};
			context.createServiceInstance(env, 'foo', zeusfile.services.foo, function(err) {
				assert.ifError(err);
				assert.ok(context.plugins['Azure.Thing'].createServiceInstance.calledWith(env, 'foo', zeusfile.services.foo, sinon.match.any));
				done();
			});
		});
	});
});