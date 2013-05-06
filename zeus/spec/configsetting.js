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
	describe('.toJSON', function() {
		it('should return null for required non-template argument', function() {
			var setting = new ConfigSetting('', true);

			assert.isNull(ConfigSetting.toJSON(setting));
		});
		it('should return string for required template argument', function() {
			var setting = new ConfigSetting('{{template}}', true);

			assert.equal(ConfigSetting.toJSON(setting), '{{template}}');
		});
		it('should return object for optional non-template argument', function() {
			var setting = new ConfigSetting('', false);

			assert.deepEqual(ConfigSetting.toJSON(setting), {required:false});
		});

		it('should return object for optional template argument', function() {
			var setting = new ConfigSetting('{{template}}', false);

			assert.deepEqual(ConfigSetting.toJSON(setting), {template: '{{template}}', required:false});
		});
	});
	describe('.fromJSON', function() {
		it('should load required template setting from string argument', function() {
			var setting = ConfigSetting.fromJSON('{{template}}');

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should load required template setting from object argument', function() {
			var setting = ConfigSetting.fromJSON({template: '{{template}}'});

			assert.instanceOf(setting, ConfigSetting);			
			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should load required template setting from object argument with explicit required setting', function() {
			var setting = ConfigSetting.fromJSON({required: true, template: '{{template}}'});

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '{{template}}');
			assert.ok(setting.required);
		});
		it('should load optional template setting from object argument', function() {
			var setting = ConfigSetting.fromJSON({required: false, template: '{{template}}'});

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '{{template}}');
			assert.ok(!setting.required);
		});
		it('should load optional setting from object argument', function() {
			var setting = ConfigSetting.fromJSON({required: false});

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '');
			assert.ok(!setting.required);
		});
		it('should load required setting from object argument', function() {
			var setting = ConfigSetting.fromJSON({required: true});

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '');
			assert.ok(setting.required);
		});
		it('should load required setting from null argument', function() {
			var setting = ConfigSetting.fromJSON(null);

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '');
			assert.ok(setting.required);
		});
		it('should load required setting from undefined argument', function() {
			var setting = ConfigSetting.fromJSON();

			assert.instanceOf(setting, ConfigSetting);
			assert.equal(setting.template, '');
			assert.ok(setting.required);
		});
	})
});