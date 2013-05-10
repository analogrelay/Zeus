function UIService(cli, log) {
	this.log = log;
}

UIService.empty = new UIService(null, {
	verbose: function() {},
	info: function() {},
	warn: function() {}
});

module.exports = exports = UIService;