var fs = require('fs'),
    path = require('path'),
    util = require('util');

var moduleVersion = require('../../../package.json').version;

function homeFolder() {
  if (process.env.HOME !== undefined) {
    return process.env.HOME;
  }

  if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
    return process.env.HOMEDRIVE + process.env.HOMEPATH;
  }

  throw new Error('No HOME path available');
}

exports.azureDir = function () {
  var dir = process.env.AZURE_CONFIG_DIR ||
    path.join(homeFolder(), '.azure');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 502); // 0766
  }

  return dir;
};

var getUserAgent = exports.getUserAgent = function () {
  return util.format('Zeus/%s', moduleVersion);
};