libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
ConfigSetting = require libpath + '/configsetting'
cryo = require libpath + '/utils/cryo'

describe 'ConfigSetting', ->
	describe '#constructor', ->
		it 'should accept (string, string, boolean)', ->
			setting = new ConfigSetting 'foo', '{{template}}', false

			assert.equal setting.name, 'foo'
			assert.equal setting.template, '{{template}}'
			assert.ok !setting.required
		
		it 'should accept (string, string)', ->
			setting = new ConfigSetting 'foo', '{{template}}'

			assert.equal setting.name, 'foo'
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required

		it 'should accept (string, boolean)', ->
			setting = new ConfigSetting 'foo', false

			assert.equal setting.name, 'foo'
			assert.equal setting.template, ''
			assert.ok !setting.required

	describe 'cryo.freeze', ->
		it 'should cryo-freeze to null for required non-template argument', ->
			setting = new ConfigSetting 'foo', '', true

			assert.isNull cryo.freeze(setting)
		
		it 'should cryo-freeze to string for required template argument', ->
			setting = new ConfigSetting 'foo', '{{template}}', true

			assert.equal cryo.freeze(setting), '{{template}}'
		
		it 'should cryo-freeze to object for optional non-template argument', ->
			setting = new ConfigSetting 'foo', '', false

			assert.deepEqual cryo.freeze(setting), { required:false }
		

		it 'should cryo-freeze to object for optional template argument', ->
			setting = new ConfigSetting 'foo', '{{template}}', false

			assert.deepEqual cryo.freeze(setting), { template: '{{template}}', required:false }
		
	describe 'cryo.revive', ->
		it 'should load required template setting from string argument', ->
			setting = cryo.revive('{{template}}', ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required
		
		it 'should load required template setting from object argument', ->
			setting = cryo.revive({ template: '{{template}}' }, ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required
		
		it 'should load required template setting from object argument with explicit required setting', ->
			setting = cryo.revive({ required: true, template: '{{template}}' }, ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required
		
		it 'should load optional template setting from object argument', ->
			setting = cryo.revive({ required: false, template: '{{template}}' }, ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok !setting.required
		
		it 'should load optional setting from object argument', ->
			setting = cryo.revive({ required: false }, ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok !setting.required
		
		it 'should load required setting from object argument', ->
			setting = cryo.revive({ required: true }, ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok setting.required
		
		it 'should load required setting from null argument', ->
			setting = cryo.revive(null, ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok setting.required
		
		it 'should load required setting from undefined argument', ->
			setting = cryo.revive(((undef) -> undef)(), ConfigSetting)

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok setting.required