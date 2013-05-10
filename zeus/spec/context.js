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
});