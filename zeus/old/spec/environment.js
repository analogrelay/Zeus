var libpath = process.env['ZEUS_COV'] ? '../lib-cov' : '../lib'

var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	Environment = require(libpath + '/environment'),
	ServiceInstance = require(libpath + '/serviceinstance'),
	fs = require('fs');

describe('Environment', function() {
	var sandbox;
	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		sandbox.stub(fs, 'writeFile');
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('#constructor', function() {
		it('should accept (string, string, object, object)', function() {
			var app = 'theapp';
			var name = 'thename';
			var services = {};
			var config = {};
			var env = new Environment(app, name, services, config);

			assert.strictEqual(app, env.app);
			assert.strictEqual(name, env.name);
			assert.strictEqual(services, env.services);
			assert.strictEqual(config, env.config);
		});

		it('should accept (string, string, object)', function() {
			var app = 'theapp';
			var name = 'thename';
			var services = {};
			var env = new Environment(app, name, services);

			assert.strictEqual(app, env.app);
			assert.strictEqual(name, env.name);
			assert.strictEqual(services, env.services);
			assert.isNotNull(env.config);
		});

		it('should accept (string, string)', function() {
			var app = 'theapp';
			var name = 'thename';
			var env = new Environment(app, name);

			assert.strictEqual(app, env.app);
			assert.strictEqual(name, env.name);
			assert.isNotNull(env.services);
			assert.isNotNull(env.config);
		});

		it('should accept (string)', function() {
			var app = 'theapp';
			var env = new Environment(app);

			assert.strictEqual(app, env.app);
			assert.strictEqual('', env.name);
			assert.isNotNull(env.services);
			assert.isNotNull(env.config);
		});

		it('should accept ()', function() {
			var env = new Environment();

			assert.strictEqual('', env.app);
			assert.strictEqual('', env.name);
			assert.isNotNull(env.services);
			assert.isNotNull(env.config);
		});
	});

	describe('#save', function() {
		it('should write cryofrozen object to provided path', function(done) {
			var expected = JSON.stringify({
				app: 'nugetgallery',
				name: 'qa',
				services: {
					'frontend': {
						config: {'foo': 42}
					}
				},
				config: {
					bar: /abc/
				}
			}, null, 2);
			var live = new Environment('nugetgallery', 'qa', {
				frontend: new ServiceInstance({foo: 42})
			}, { bar: /abc/ });
			fs.writeFile.yields();

			live.save('path/to/file', function() {
				assert.ok(fs.writeFile.calledWith('path/to/file', expected, sinon.match.func));
				done();
			});
		});
	});

	describe('.revive', function() {
		it('should return a true environment object with service instances', function() {
			var frozen = {
				app: 'nugetgallery',
				name: 'qa',
				services: {
					'frontend': {
						config: {'foo': 42}
					}
				},
				config: {
					bar: /abc/
				}
			};
			var expected = new Environment('nugetgallery', 'qa', {
				frontend: new ServiceInstance({foo: 42})
			}, { bar: /abc/ });
			var revived = Environment.revive(frozen);

			assert.deepEqual(revived, expected);
			assert.instanceOf(revived, Environment);
		});
	});

	describe('.cryofreeze', function() {
		it('should return a frozen environment object', function() {
			var expected = {
				app: 'nugetgallery',
				name: 'qa',
				services: {
					'frontend': {
						config: {'foo': 42}
					}
				},
				config: {
					bar: /abc/
				}
			};
			var live = new Environment('nugetgallery', 'qa', {
				frontend: new ServiceInstance({foo: 42})
			}, { bar: /abc/ });
			var frozen = Environment.cryofreeze(live);

			assert.deepEqual(frozen, expected);
		});
	});
});