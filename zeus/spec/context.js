var assert = require('assert'),
	path = require('path'),
	sandbox = require('sandboxed-module'),
	sinon = require('sinon');

function underTest() {
	// Create mock modules
	var requires = {
		'fs': {
			writeFile: sinon.stub()
		}
	};
	var obj = sandbox.require('../lib/context.js', {
		requires: requires
	});
	obj._ = requires;
	return obj;
}

describe('zeus', function() {
	describe('Context', function() {
		describe('#save', function() {
			it('should produce error from FS module', function(done) {
				// Arrange
				var Context = underTest();
				var context = new Context({boo:'urns'}, 'this/aint/real');
				var expected = new Error('Ruh roh!');
				var writeFile = Context._.fs.writeFile;
				writeFile.callsArgWith(2, expected);

				// Act
				context.save(function(actual) {
					assert.equal(expected, actual);
					assert.ok(writeFile.called);
					assert.equal(writeFile.getCall(0).args[0], 'this/aint/real');
					assert.equal(writeFile.getCall(0).args[1], "{\n  \"boo\": \"urns\"\n}");
					done();
				})
			})
			it('should produce falsey arg if successful', function(done) {
				// Arrange
				var Context = underTest();
				var context = new Context({boo:'urns'}, 'this/aint/real');
				var writeFile = Context._.fs.writeFile;
				writeFile.callsArgWith(2, false);

				// Act
				context.save(function(err) {
					assert.ok(!err);
					assert.ok(writeFile.called);
					assert.equal(writeFile.getCall(0).args[0], 'this/aint/real');
					assert.equal(writeFile.getCall(0).args[1], "{\n  \"boo\": \"urns\"\n}");
					done();
				})
			})
		})
	})
})

