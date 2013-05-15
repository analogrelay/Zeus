var libpath = process.env['ZEUS_COV'] ? '../lib-cov' : '../lib'

var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	Environment = require(libpath + '/environment');

describe('Environment', function() {
	describe('#constructor', function() {
		it('should accept (string, string)', function() {
			var app = 'theapp';
			var name = 'thename';
			var env = new Environment(app, name);

			assert.strictEqual(app, env.app);
			assert.strictEqual(name, env.name);
		});

		it('should accept (string)', function() {
			var app = 'theapp';
			var env = new Environment(app);

			assert.strictEqual(app, env.app);
			assert.strictEqual('', env.name);
		});

		it('should accept ()', function() {
			var env = new Environment();

			assert.strictEqual('', env.app);
			assert.strictEqual('', env.name);
			assert.isNotNull(env.services);
			assert.isNotNull(env.config);
		});
	});
	describe('#cryofreeze', function() {
		
	});
});