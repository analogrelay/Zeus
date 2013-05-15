function Plugin(context, ui) {
	this.context = context;
	this.ui = ui;
}

Plugin.prototype.collectGlobalConfiguration = function(callback) {
	// Nothing to do by default
};

module.exports = exports = Plugin;