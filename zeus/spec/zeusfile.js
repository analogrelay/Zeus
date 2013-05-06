var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	Zeusfile = require('../lib/zeusfile.js'),
	ZeusService = require('../lib/zeusservice.js');

describe('Zeusfile', function() {
	describe('#constructor', function() {
		it('should initialize services', function() {
			assert.isNotNull(new Zeusfile('foo').services);
		});
		it('should initialize name', function() {
			assert.equal(new Zeusfile('foo').name, 'foo');
		});
	});
	describe('.toJSON', function () {
		it('should return a simple Zeusfile', function() {
			var zf = new Zeusfile('app');
			zf.services.foo = new ZeusService('bar');
			
			assert.deepEqual(Zeusfile.toJSON(zf), { name: 'app', services: { foo: {type: 'bar', config:{}}}});
		});
	});
	describe('.fromJSON', function () {
		it('should load the name and empty services from name only', function() {
			var zf = Zeusfile.fromJSON({name: 'app'});
			
			assert.instanceOf(zf, Zeusfile);
			assert.equal(zf.name, 'app');
			assert.isNotNull(zf.services);
		});
		it('should revive services', function() {
			var zf = Zeusfile.fromJSON({name: 'app', services: {'foo': {type: 'bar'}}});
			
			assert.instanceOf(zf, Zeusfile);
			assert.equal(zf.name, 'app');
			assert.isNotNull(zf.services);
			assert.isDefined(zf.services.foo);
			assert.instanceOf(zf.services.foo, ZeusService);
			assert.equal(zf.services.foo.type, 'bar');
		});
	});
});