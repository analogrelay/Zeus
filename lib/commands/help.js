exports.init = function (cli) {
  function findCommand(name) {
    for(var i in cli.commands) {
      var cmd = cli.commands[i];
      if(cmd._name === name) {
        return cmd;
      }
    }
    return null;
  }

  cli.command('help [command]')
        .description('Display help for a given command')
        .action(function (name) {
          if (!name) {
            cli.parse(['', '', '-h']);
          } else if(findCommand(name)) {
            cli.parse(['', '', name, '-h']);
          } else if (!cli.categories[name]) {
            throw new Error('Unknown command name ' + name);
          } else {
            var args = ['', ''].concat(cli.rawArgs.slice(4), ['-h']);
            cli.categories[name].parse(args);
          }
        });
};
