var libpath = process.env['ZEUS_COV'] ? '../lib-cov' : '../lib'

var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	ServiceInstance = require(libpath + '/serviceinstance');

describe('ServiceInstance', function() {
	describe('#constructor', function() {
		it('should accept (object)', function() {
			var config = {};
			var instance = new ServiceInstance(config);

			assert.strictEqual(config, instance.config);
		});
		it('should accept ()', function() {
			var instance = new ServiceInstance();

			assert.isNotNull(instance.config);
		});
	});

	describe('.revive', function() {
		it('should return a true service instance', function() {
			var frozen = {
				config: {'foo': 42}
			}
			var expected = new ServiceInstance({foo: 42});
			var revived = ServiceInstance.revive(frozen);

			assert.deepEqual(revived, expected);
			assert.instanceOf(revived, ServiceInstance);
		});
	});

	describe('.cryofreeze', function() {
		it('should return a frozen serviceinstance object', function() {
			var expected = {
				config: {'foo': 42}
			};
			var live = new ServiceInstance({foo: 42});
			var frozen = ServiceInstance.cryofreeze(live);

			assert.deepEqual(frozen, expected);
		});
	});
});