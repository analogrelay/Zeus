var assert = require('assert'),
	path = require('path'),
	sandbox = require('sandboxed-module'),
	sinon = require('sinon');

function underTest() {
	// Create mock modules
	var requires = {
		'fs': {
			exists: sinon.stub(),
			readFile: sinon.stub()
		}
	};
	var obj = sandbox.require('../lib/zeus.js', {
		requires: requires
	});
	obj._ = requires;
	return obj;
}

describe('zeus', function() {
	describe('#context(dir, appname)', function() {
		it('should throw if zeus context already exists', function(done) {
			// Arrange
			var zeus = underTest();
			zeus._.fs
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
			var zeus = underTest();
			zeus._.fs
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
			var zeus = underTest();
			var root = 'root';
			var sub = path.join(root, 'sub');
			var subsub = path.join(sub, 'subsub');
			zeus._.fs
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
			var zeus = underTest();
			var root = 'root';
			var sub = path.join(root, 'sub');
			var subsub = path.join(sub, 'subsub');
			var zfpath = path.join(subsub, 'Zeusfile');
			zeus._.fs
				.exists
				.withArgs(zfpath, sinon.match.func)
				.yields(true);
			zeus._.fs
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
			var zeus = underTest();
			var root = 'root';
			var sub = path.join(root, 'sub');
			var subsub = path.join(sub, 'subsub');
			var zfpath = path.join(sub, 'Zeusfile');
			zeus._.fs
				.exists
				.withArgs(zfpath, sinon.match.func)
				.yields(true);
			zeus._.fs
				.exists
				.withArgs(path.join(subsub, 'Zeusfile'), sinon.match.func)
				.yields(false);
			zeus._.fs
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
			var zeus = underTest();
			var root = 'root';
			var sub = path.join(root, 'sub');
			var subsub = path.join(sub, 'subsub');
			var zfpath = path.join(root, 'Zeusfile');
			zeus._.fs
				.exists
				.withArgs(zfpath, sinon.match.func)
				.yields(true);
			zeus._.fs
				.exists
				.withArgs(path.join(subsub, 'Zeusfile'), sinon.match.func)
				.yields(false);
			zeus._.fs
				.exists
				.withArgs(path.join(sub, 'Zeusfile'), sinon.match.func)
				.yields(false);
			zeus._.fs
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
})

