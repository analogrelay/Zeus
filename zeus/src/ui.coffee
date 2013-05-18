emptyCli = {}
emptyLog = {
	verbose: () ->
	info: () ->
	warn: () ->
}

module.exports = class UIService
	constructor: (@cli, @log) ->
	@empty = new UIService emptyCli, emptyLog