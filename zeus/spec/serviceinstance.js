var libpath = process.env['ZEUS_COV'] ? '../lib-cov' : '../lib'

var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	ServiceInstance = require(libpath + '/serviceinstance');

describe('ServiceInstance', function() {
	describe('#constructor', function() {
		it('should accept (string, object)', function() {
			var name = 'thename';
			var config = {};
			var instance = new ServiceInstance(name, config);

			assert.strictEqual(name, instance.name);
			assert.strictEqual(config, instance.config);
		});
		it('should accept (string)', function() {
			var name = 'thename';
			var instance = new ServiceInstance(name);

			assert.strictEqual(name, instance.name);
			assert.isNotNull(instance.config);
		});
		it('should accept ()', function() {
			var instance = new ServiceInstance();

			assert.strictEqual('', instance.name);
			assert.isNotNull(instance.config);
		});
	});
});