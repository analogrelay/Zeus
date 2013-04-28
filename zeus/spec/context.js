var assert = require('assert'),
	path = require('path'),
	sinon = require('sinon');

describe('Context', function() {
	describe('#save', function() {
		var fs = require('fs');
		var zeus = require('../lib/zeus.js');
		var zf = new zeus.Zeusfile('test')
		var expectedString = JSON.stringify({name: "test", services: {}}, null, 2);
		var sandbox;
		beforeEach(function() {
			sandbox = sinon.sandbox.create();

			// Stub out functions
			sandbox.stub(fs, 'writeFile');
		});
		afterEach(function() {
			// Clean up the sandbox
			sandbox.restore();
		})

		it('should produce error from FS module', function(done) {
			// Arrange
			var context = new zeus.Context(zf, 'this/aint/real');
			var expected = new Error('Ruh roh!');
			fs.writeFile.yields(expected);

			// Act
			context.save(function(actual) {
				assert.equal(expected, actual);
				assert.ok(fs.writeFile.called);
				assert.equal(fs.writeFile.getCall(0).args[0], 'this/aint/real');
				assert.equal(fs.writeFile.getCall(0).args[1], expectedString);
				done();
			})
		})
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
			})
		})
	})
})