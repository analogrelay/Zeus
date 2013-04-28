var assert = require('assert'),
	path = require('path'),
	sinon = require('sinon');

describe('#context(dir, appname)', function() {
	var root = 'root';
	var sub = path.join(root, 'sub');
	var subsub = path.join(sub, 'subsub');

	var fs = require('fs');
	var zeus = require('../lib/zeus.js');
	var sandbox;
	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		// Stub out functions
		sandbox.stub(fs, 'exists');
		sandbox.stub(fs, 'readFile');
	});
	afterEach(function() {
		// Clean up the sandbox
		sandbox.restore();
	})

	it('should throw if zeus context already exists', function(done) {
		// Arrange
		fs
			.exists
			.withArgs(path.join('mydir', 'Zeusfile'), sinon.match.func)
			.yields(true);
		
		// Act/Assert
		zeus.context('mydir', 'newapp', function(err, context) {
			assert.equal("Can't create a new Zeusfile. There is already one in this directory", err.message);
			done();
		});
	});
	it('should return context with Zeusfile path if no file exists', function(done) {
		// Arrange
		fs
			.exists
			.withArgs(path.join('mydir', 'Zeusfile'), sinon.match.func)
			.yields(false);

		// Act
		var context = zeus.context('mydir', 'myApp', function(err, context) {
			// Assert
			assert.ifError(err);
			assert.equal(context.path, path.join('mydir', 'Zeusfile'));
			assert.equal(context.zf.name, 'myApp');
			done();
		});
	});
	it('should throw if no app name provides and no Zeusfile found', function(done) {
		// Arrange
		fs
			.exists
			.yields(false);
		
		// Act
		var context = zeus.context(subsub, function(err, context) {
			assert.equal(err.message, "No Zeusfile found!");
			done();
		});
	});
	it('should load same-folder Zeusfile', function(done) {
		// Arrange
		var zfpath = path.join(subsub, 'Zeusfile');
		fs
			.exists
			.withArgs(zfpath, sinon.match.func)
			.yields(true);
		fs
			.readFile
			.withArgs(zfpath, sinon.match.func)
			.yields(null, "{ \"name\": \"the test app\" }");
		
		// Act
		var context = zeus.context(subsub, function(err, context) {
			assert.ifError(err);
			assert.equal(context.path, zfpath);
			assert.equal(context.zf.name, 'the test app');
			done();
		});
	});
	it('should load parent folder Zeusfile', function(done) {
		// Arrange
		var zfpath = path.join(sub, 'Zeusfile');
		fs
			.exists
			.withArgs(zfpath, sinon.match.func)
			.yields(true);
		fs
			.exists
			.withArgs(path.join(subsub, 'Zeusfile'), sinon.match.func)
			.yields(false);
		fs
			.readFile
			.withArgs(zfpath, sinon.match.func)
			.yields(null, "{ \"name\": \"the test app\" }");
		
		// Act
		var context = zeus.context(subsub, function(err, context) {
			assert.ifError(err);
			assert.equal(context.path, zfpath);
			assert.equal(context.zf.name, 'the test app');
			done();
		});
	});
	it('should load grandparent folder Zeusfile', function(done) {
		// Arrange
		var zfpath = path.join(root, 'Zeusfile');
		fs
			.exists
			.withArgs(zfpath, sinon.match.func)
			.yields(true);
		fs
			.exists
			.withArgs(path.join(subsub, 'Zeusfile'), sinon.match.func)
			.yields(false);
		fs
			.exists
			.withArgs(path.join(sub, 'Zeusfile'), sinon.match.func)
			.yields(false);
		fs
			.readFile
			.withArgs(zfpath, sinon.match.func)
			.yields(null, "{ \"name\": \"the test app\" }");
		
		// Act
		var context = zeus.context(subsub, function(err, context) {
			assert.ifError(err);
			assert.equal(context.path, zfpath);
			assert.equal(context.zf.name, 'the test app');
			done();
		});
	});
})