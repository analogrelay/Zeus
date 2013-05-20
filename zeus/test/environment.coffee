path = require 'path'
fs = require 'fs'

Environment = apprequire 'environment'
ServiceInstance = apprequire 'serviceinstance'

describe 'Environment', ->
	beforeEach ->
		sandbox.stub fs, 'writeFile'

	describe '#constructor', ->
		it 'should accept (string, string, object, object)', ->
			app = 'theapp'
			name = 'thename'
			config = {}
			env = new Environment app, name, config

			assert.strictEqual app, env.app
			assert.strictEqual name, env.name
			assert.instanceOf env.instances, ServiceInstance.List
			assert.equal env.instances.length, 0
			assert.strictEqual config, env.config

		it 'should accept (string, string, object)', ->
			app = 'theapp'
			name = 'thename'
			config = {}
			env = new Environment app, name, config

			assert.strictEqual app, env.app
			assert.strictEqual name, env.name
			assert.strictEqual config, env.config

		it 'should accept (string, string)', ->
			app = 'theapp'
			name = 'thename'
			env = new Environment app, name

			assert.strictEqual app, env.app
			assert.strictEqual name, env.name
			assert.isNotNull env.instances
			assert.isNotNull env.config

		it 'should accept (string)', ->
			app = 'theapp'
			env = new Environment app

			assert.strictEqual app, env.app
			assert.strictEqual '', env.name
			assert.isNotNull env.instances
			assert.isNotNull env.config

		it 'should accept ()', ->
			env = new Environment()

			assert.strictEqual '', env.app
			assert.strictEqual '', env.name
			assert.isNotNull env.instances
			assert.isNotNull env.config

	# describe '#save', ->
	# 	it 'should write cryofrozen object to provided path', (done) ->
	# 		expected = JSON.stringify(
	# 			app: 'nugetgallery',
	# 			name: 'qa',
	# 			services:
	# 				'frontend':
	# 					config: 
	# 						'foo': 42
	# 			config:
	# 				bar: /abc/
	# 		, null, 2)
			
	# 		live = new Environment('nugetgallery', 'qa', {
	# 			frontend: new ServiceInstance({foo: 42})
	# 		}, { bar: /abc/ })

	# 		fs.writeFile.yields()

	# 		live.save 'path/to/file', ->
	# 			assert.ok fs.writeFile.calledWith 'path/to/file', expected, sinon.match.func
	# 			done()

	# describe '.revive', ->
	# 	it 'should return a true environment object with service instances', ->
	# 		frozen =
	# 			app: 'nugetgallery',
	# 			name: 'qa',
	# 			services:
	# 				'frontend':
	# 					config:
	# 						'foo': 42
	# 			config:
	# 				bar: /abc/

	# 		expected = new Environment('nugetgallery', 'qa', {
	# 			frontend: new ServiceInstance({foo: 42})
	# 		}, { bar: /abc/ })

	# 		revived = Environment.revive frozen

	# 		assert.deepEqual revived, expected
	# 		assert.instanceOf revived, Environment

	# describe '#cryofreeze', ->
	# 	it 'should return a frozen environment object', ->
	# 		expected =
	# 			app: 'nugetgallery',
	# 			name: 'qa',
	# 			services:
	# 				'frontend':
	# 					config: 
	# 						'foo': 42
	# 			config:
	# 				bar: 'abc'

	# 		live = new Environment('nugetgallery', 'qa', {
	# 			frontend: new ServiceInstance({foo: 42})
	# 		}, { bar: 'abc' })

	# 		frozen = live.cryofreeze()

	# 		assert.deepEqual frozen, expected