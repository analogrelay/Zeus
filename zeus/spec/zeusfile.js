var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	Zeusfile = require('../lib/zeusfile.js');

describe('Zeusfile', function() {
	describe('#constructor', function() {
		it('should initialize services', function() {
			assert.isNotNull(new Zeusfile('foo').services);
		});
		it('should initialize name', function() {
			assert.equal(new Zeusfile('foo').name, 'foo');
		});
	});
});