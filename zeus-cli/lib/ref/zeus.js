// Try to find Zeus
var zeus;
try{
	zeus = require('../../../zeus');
} catch(err){
	if(err.code === 'MODULE_NOT_FOUND'){
		zeus = require('zeus');
	}
}

exports = module.exports = zeus;