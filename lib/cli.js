var commander = require('commander'),
	path = require('path'),
	eyes = require('eyes'),
	fs = require('fs'),
	log = require('winston'),
	q = require('q');

var cli = new commander.Command();

log.cli();

log.format = function (options) {
  for (var i in log['default'].transports) {
    if (log['default'].transports.hasOwnProperty(i)) {
      var transport = log['default'].transports[i];
      if (arguments.length === 0) {
        return {
          json: transport.json,
          terse: transport.terse,
          level: transport.level,
          logo: log.format.logo
        };
      }

      if (options.json) {
        log.padLevels = false;
        log.stripColors = true;
        transport.json = true;
        transport.terse = true;
      } else {
        log.padLevels = true;
        log.stripColors = false;
        transport.json = false;
        transport.terse = false;
      }

      if (options.terse) {
        log.padLevels = false;
        transport.terse = true;
      }

      if (options.level) {
        transport.level = options.level;
      }

      if (options.logo) {
        log.format.logo = options.logo;
      }
    }
  }
};


log.json = function (level, data) {
  if (arguments.length == 1) {
    data = level;
    level = 'data';
  }

  if (log.format().json) {
    log.log(level, typeof data, data);
  } else {
    var lines = eyes.inspect(data, level, { stream: false });
    lines.split('\n').forEach(function (line) {
      // eyes all is "cyan" by default, so this property accessor will
      // fix the entry/exit color codes of the line. it's needed because we're
      // splitting the eyes formatting and inserting winston formatting where it
      // wasn't before.
      log.log(level, line[eyes.defaults.styles.all]);
    });
  }
};


log.table = function (level, data, transform) {
  if (arguments.length == 2) {
    transform = data;
    data = level;
    level = 'data';
  }

  if (log.format().json) {
    log.log(level, 'table', data);
  } else {
    var table = new Table();
    table.LeftPadder = Table.LeftPadder;
    table.padLeft = Table.padLeft;
    table.RightPadder = Table.RightPadder;
    table.padRight = Table.padRight;

    if (data && data.forEach) {
      data.forEach(function (item) { transform(table, item); table.newLine(); });
    } else if (data) {
      for (var item in data) {
        transform(table, item);
        table.newLine();
      }
    }

    var lines = table.toString();
    lines.substring(0, lines.length - 1).split('\n').forEach(function (line) {
      log.log(level, line);
    });
  }
};

function setupCommand(args, raw, topMost) {
  var verbose = 0;
  var json = 0;
  var category = '*';

  for (var i = 0, len = raw.length; i < len; ++i) {
    if (raw[i] === '--json') {
      ++json;
    } else if (raw[i] === '-v' || raw[i] === '--verbose') {
      ++verbose;
    } else if (category === '*') {
      category = raw[i];
    } else {
      args.push(raw[i]);
    }
  }

  var opts = { };
  if (verbose || json) {
    if (json) {
      opts.json = true;
      opts.level = 'data';
    }

    if (verbose == 1) {
      opts.json = false;
      opts.level = 'verbose';
    }

    if (verbose >= 2) {
      opts.json = false;
      opts.level = 'silly';
    }

    log.format(opts);
  } else if (topMost) {
    opts = {
      json: false,
      level: 'info'
    };

    log.format(opts);
  }

  return category;
}

function enableNestedCommands(command) {
  command.option('-v, --verbose', 'use verbose output');
  command.option('--json', 'use json output');

  command.categories = {};

  command.category = function (name) {
    var category = command.categories[name];
    if (!command.categories[name]) {
      category = command.categories[name] = new commander.Command();
      category.parent = this;
      category.name = name;
      category.helpInformation = categoryHelpInformation;
      enableNestedCommands(category);
    }

    return category;
  };

  command.on('*', function () {
    var args = command.rawArgs.slice(0, 2);
    var raw = command.normalize(command.rawArgs.slice(2));

    var category = setupCommand(args, raw, command.parent === undefined);

    if (!command.categories[category]) {
      log.error('\'' + category + '\' is not a zeus command. See \'zeus help\'.');
    } else {
      command.categories[category].parse(args);
      if (command.categories[category].args.length === 0) {
        args.push('-h');
        command.categories[category].parse(args);
      }
    }
  });
}
enableNestedCommands(cli);

cli.helpInformation = rootHelpInformation;

// support multiple levels in commans parsing
commander.Command.prototype.parseOptions = function(argv){
  var args = [];
  var len = argv.length;
  var literal = false;
  var option;
  var arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if ('--' == arg) {
      literal = true;
      continue;
    }

    if (literal) {
      args.push(arg);
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);

    //// patch begins
    var commandOption = null;

    if (!option && arg[0] === '-') {
      var command = this;
      var arga = null;
      for(var a = 0; a < args.length && command && !commandOption; ++a) {
        arga = args[a];
        if (command.categories && (arga in command.categories)) {
          command = command.categories[arga];
          commandOption = command.optionFor(arg);
          continue;
        }
        break;
      }
      if (!commandOption && arga && command && command.commands) {
        for(var j in command.commands) {
          if (command.commands[j].name === arga) {
            commandOption = command.commands[j].optionFor(arg);
            break;
          }
        }
      }
    }
    //// patch ends

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (!arg) {
          return this.optionMissingArgument(option);
        }

        if ('-' === arg[0]) {
          return this.optionMissingArgument(option, arg);
        }

        this.emit(option.name(), arg);
      } else if (option.optional) {
        // optional arg
        arg = argv[i+1];
        if (!arg || '-' === arg[0]) {
          arg = null;
        } else {
          ++i;
        }

        this.emit(option.name(), arg);
      // bool
      } else {
        this.emit(option.name());
      }
      continue;
    }

    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      unknownOptions.push(arg);

      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      //// patch: using commandOption if available to detect if the next value is an argument
      // If it isn't, then it'll simply be ignored
      commandOption = commandOption || {optional : 1}; // default assumption
      if (commandOption.required || (commandOption.optional && argv[i+1] && '-' != argv[i+1][0])) {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }

    // arg
    args.push(arg);
  }

  return { args: args, unknown: unknownOptions };
};

commander.Command.prototype.helpInformation = commandHelpInformation;

commander.Command.prototype.fullName = function () {
  var name = this._name;
  var scan = this.parent;
  while (scan.parent !== undefined) {
    name = scan._name + ' ' + name;
    scan = scan.parent;
  }

  return name;
};

commander.Command.prototype.execute = function (fn) {
  var self = this;
  return self.action(function () {
    if (log.format().json) {
      log.verbose('Executing command ' + self.fullName().bold);
    } else {
      log.info('Executing command ' + self.fullName().bold);
    }

    try {
      // pass no more arguments than the function expects, including options and callback at the end (unless it expects 0 or 1)
      var argCount = fn.length <= 1 ? arguments.length : fn.length - 1; // not including callback
      var args = new Array(argCount);
      var optionIndex = arguments.length - 1;
      for (var i = 0; i < arguments.length; ++i) {
        if (typeof arguments[i] === 'object') {
          optionIndex = i;
          break;
        }
        if (i < argCount - 1) {
          args[i] = arguments[i];
        }
      }
      // append with options and callback
      args[argCount - 1] = arguments[optionIndex];
      args.push(callback);
      fn.apply(this, args);
    }
    catch (err) {
      callback(err);
    }

    function callback(err) {
      if (err) {
        // Exceptions should always be logged to the console
        var noConsole = false;
        if (!log['default'].transports.console) {
          noConsole = true;
          cli.output.add(cli.output.transports.Console);
        }

        if (err.message) {
          log.error(err.message);
          log.json('silly', err);
        } else if (err.Message) {
          if (typeof err.Message === 'object' && typeof err.Message['#'] === 'string') {
            var innerError;
            try {
              innerError = JSON.parse(err.Message['#']);
            } catch (e) {
              // empty
            }

            if (innerError) {
              if (noConsole) {
                cli.output.remove(cli.output.transports.Console);
              }

              return callback(innerError);
            }
          }

          log.error(err.Message);
          log.json('verbose', err);
        } else {
          log.error(err);
        }

        recordError(err);
        if (err.stack) {
          (debug ? log.error : log.verbose)(err.stack);
        }

        if (noConsole) {
          cli.output.remove(cli.output.transports.Console);
        }

        cli.exit('error', self.fullName().bold + ' command ' + 'failed\n'.red.bold, 1);
      } else {
        if (log.format().json) {
          cli.exit('verbose', self.fullName().bold + ' command ' + 'OK'.green.bold, 0);
        }
        else {
          cli.exit('info', self.fullName().bold + ' command ' + 'OK'.green.bold, 0);
        }
      }
    }
  });
};

function rootHelpInformation() {
  var args = process.argv.slice(0, 2);
  var raw = cli.normalize(process.argv.slice(2));
  setupCommand(args, raw, true);

  if (log.format().logo === 'on') {
    log.info(' _____   ________  _______');
	log.info('/__  /  / ____/ / / / ___/');
	log.info('  / /  / __/ / / / /\__ \ ');
	log.info(' / /__/ /___/ /_/ /___/ / ');
	log.info('/____/_____/\____//____/  ');
  }

  var packagePath = path.join(__dirname, '../package.json');
  var packageInfo = JSON.parse(fs.readFileSync(packagePath));

  log.info('Zeus! GOD OF THE CLOUDS!');
  log.info('');
  log.info('Tool version', packageInfo.version);

  helpCommands(this);
  helpCategoriesSummary(this);
  helpOptions(this);

  return '';
}

function categoryHelpInformation() {
  log.help(this.description());
  helpCommands(this);
  helpCategories(this);
  helpOptions(this);

  return '';
}

function commandHelpInformation() {
  log.help(this.description());
  log.help('');
  log.help('Usage:', this.fullName() + ' ' + this.usage());
  helpOptions(this, cli);

  return '';
}

function helpCategories(parent) {
  for (var name in parent.categories) {
    var cat = parent.categories[name];
    log.help('');
    log.help(cat.description().cyan);
    for (var index in cat.commands) {
      var cmd = cat.commands[index];
      log.help(' ', cmd.fullName() + ' ' + cmd.usage());
    }
    helpCategories(cat);
    for (var subCat in cat.categories) {
      helpCategories(cat.categories[subCat]);
      //log.help(' ', cat.categories[subCat].fullName() + ' ...');
    }
  }
}

function helpCategoriesSummary(root) {
  var categories = [];
  function scan(parent, each) {
    for (var name in parent.categories) {
      var cat = parent.categories[name];
      each(cat);
      scan(cat, each);
    }
  }

  scan(root, function (cat) { categories.push(cat); });
  var maxLength = 14;
  categories.forEach(function (cat) {
    if (maxLength < cat.fullName().length)
      maxLength = cat.fullName().length;
  });

  log.help('');
  log.help('Commands:');
  categories.forEach(function (cat) {
    var name = cat.fullName();
    while (name.length < maxLength) {
      name += ' ';
    }
    log.help('  ' + name + ' ' + cat.description().cyan);
  });
}

function helpCommands(parent) {
  parent.commands.forEach(function (cmd) {
    log.help('');
    log.help(cmd.description().cyan);
    log.help(' ', cmd.fullName() + ' ' + cmd.usage());
  });
}

function helpOptions(cmd, cmdExtra) {
  var revert = cmd.options;
  if (cmdExtra) {
    cmd.options = cmd.options.concat(cmdExtra.options);
  }

  log.help('');
  log.help('Options:');
  cmd.optionHelp().split('\n').forEach(function (line) { log.help(' ', line); });
  cmd.options = revert;
}

function harvestPlugins() {
  function scan(scanPath) {
    var results = fs.readdirSync(scanPath);

    results = results.filter(function (filePath) {
      if (filePath.substring(0, 5) === 'tmp--') {
        return false;
      }
      return true;
    });

    // sort them so they load in a predictable order
    results = results.sort();

    // combine file path
    results = results.map(function (fileName) {
      return path.join(scanPath, fileName);
    });

    // skip directories
    results = results.filter(function (filePath) {
      return fs.statSync(filePath).isFile();
    });

    // load modules
    results = results.map(function (filePath) {
      return require(filePath);
    });

    // look for exports.init
    results = results.filter(function (entry) {
      return entry.init !== undefined;
    });
    return results;
  }

  var basePath = path.dirname(__filename);

  var plugins = scan(path.join(basePath, 'commands'));
  plugins.forEach(function (plugin) { plugin.init(cli); });
}
harvestPlugins();

exports = module.exports = cli;