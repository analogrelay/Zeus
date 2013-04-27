var assert = require('assert'),
	path = require('path'),
	sandbox = require('sandboxed-module'),
	sinon = require('sinon');

function underTest() {
	// Create mock modules
	var requires = {
		'fs': {
			existsSync: sinon.stub()
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
		it('should throw if zeus context already exists', function() {
			// Arrange
			var zeus = underTest();
			zeus._.fs.existsSync.withArgs(path.join('mydir', 'Zeusfile')).returns(true);
			
			// Act/Assert
			assert.throws(
				function() {
					zeus.context('mydir', 'newapp');
				},
				"Can't create a new Zeusfile. There is already one in this directory"
			);
		});
		it('should return context with Zeusfile path if no file exists', function() {
			// Arrange
			var zeus = underTest();
			zeus._.fs.existsSync.withArgs(path.join('mydir', 'Zeusfile')).returns(false);

			// Act
			var context = zeus.context('mydir', 'myApp');

			// Assert
			assert.equal(context.path, path.join('mydir', 'Zeusfile'));
			assert.equal(context.zf.name, 'myApp');
		});
	})
})

