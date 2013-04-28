var assert = require('chai').assert,
	path = require('path'),
	sinon = require('sinon'),
	ConfigSetting = require('../lib/configsetting.js');

describe('ConfigSetting', function() {
	describe('#constructor', function() {
		it('should accept (string, boolean)', function() {
			var setting = new ConfigSetting('{{template}}', false);

			assert.equal(setting.template, '{{template}}');
			assert.ok(!setting.required);
		});
		it('should accept (string)', function() {
			var setting = new ConfigSetting('{{template}}');

			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should accept (boolean)', function() {
			var setting = new ConfigSetting(false);

			assert.equal(setting.template, '');
			assert.ok(!setting.required);
		});
	});
	describe('#cryo', function() {
		it('should return null for required non-template argument', function() {
			var setting = new ConfigSetting('', true);

			assert.isNull(setting.cryo());
		});
		it('should return string for required template argument', function() {
			var setting = new ConfigSetting('{{template}}', true);

			assert.equal(setting.cryo(), '{{template}}');
		});
		it('should return object for optional non-template argument', function() {
			var setting = new ConfigSetting('', false);

			assert.deepEqual(setting.cryo(), {required:false});
		});

		it('should return object for optional template argument', function() {
			var setting = new ConfigSetting('{{template}}', false);

			assert.deepEqual(setting.cryo(), {template: '{{template}}', required:false});
		});
	});
	describe('.revive', function() {
		it('should load required template setting from string argument', function() {
			var setting = ConfigSetting.revive('{{template}}');

			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should load required template setting from object argument', function() {
			var setting = ConfigSetting.revive({template: '{{template}}'});

			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should load required template setting from object argument with explicit required setting', function() {
			var setting = ConfigSetting.revive({required: true, template: '{{template}}'});

			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should load optional template setting from object argument', function() {
			var setting = ConfigSetting.revive({required: false, template: '{{template}}'});

			assert.equal(setting.template, '{{template}}');
			assert.ok(!setting.required);
		});
		it('should load optional setting from object argument', function() {
			var setting = ConfigSetting.revive({required: false});

			assert.equal(setting.template, '');
			assert.ok(!setting.required);
		});
		it('should load required setting from object argument', function() {
			var setting = ConfigSetting.revive({required: true});

			assert.equal(setting.template, '');
			assert.ok(setting.required);
		});
		it('should load required setting from null argument', function() {
			var setting = ConfigSetting.revive(null);

			assert.equal(setting.template, '');
			assert.ok(setting.required);
		});
		it('should load required setting from undefined argument', function() {
			var setting = ConfigSetting.revive();

			assert.equal(setting.template, '');
			assert.ok(setting.required);
		});
	})
});