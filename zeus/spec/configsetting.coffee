libpath = if process.env['ZEUS_COV'] then '../lib-cov' else '../lib'

assert = require('chai').assert
path = require 'path'
sinon = require 'sinon'
ConfigSetting = require libpath + '/configsetting.js'

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

	describe '#cryofreeze', ->
		it 'should cryo-freeze to null for required non-template argument', ->
			setting = new ConfigSetting 'foo', '', true

			assert.isNull setting.cryofreeze()
		
		it 'should cryo-freeze to string for required template argument', ->
			setting = new ConfigSetting 'foo', '{{template}}', true

			assert.equal setting.cryofreeze(), '{{template}}'
		
		it 'should cryo-freeze to object for optional non-template argument', ->
			setting = new ConfigSetting 'foo', '', false

			assert.deepEqual setting.cryofreeze(), { required:false }
		

		it 'should cryo-freeze to object for optional template argument', ->
			setting = new ConfigSetting 'foo', '{{template}}', false

			assert.deepEqual setting.cryofreeze(), { template: '{{template}}', required:false }
		
	describe '.revive', ->
		it 'should load required template setting from string argument', ->
			setting = ConfigSetting.revive '{{template}}'

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required
		
		it 'should load required template setting from object argument', ->
			setting = ConfigSetting.revive { template: '{{template}}' }

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required
		
		it 'should load required template setting from object argument with explicit required setting', ->
			setting = ConfigSetting.revive { required: true, template: '{{template}}' }

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok setting.required
		
		it 'should load optional template setting from object argument', ->
			setting = ConfigSetting.revive { required: false, template: '{{template}}' }

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, '{{template}}'
			assert.ok !setting.required
		
		it 'should load optional setting from object argument', ->
			setting = ConfigSetting.revive { required: false }

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok !setting.required
		
		it 'should load required setting from object argument', ->
			setting = ConfigSetting.revive { required: true }

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok setting.required
		
		it 'should load required setting from null argument', ->
			setting = ConfigSetting.revive null

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok setting.required
		
		it 'should load required setting from undefined argument', ->
			setting = ConfigSetting.revive()

			assert.instanceOf setting, ConfigSetting
			assert.equal setting.template, ''
			assert.ok setting.required