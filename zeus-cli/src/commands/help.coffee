# Converted From azure-cli

_ = require 'underscore'

exports.init = (ui) ->
    ui.cli.command('help [command]')
        .description('Display help for a given command')
        .action (name) ->
            if not name
                ui.cli.parse ['', '', '-h']
            else if _.findWhere ui.cli.commands, { name: name }
                ui.cli.parse ['', '', name, '-h']
            else if not ui.cli.categories[name]
                throw new Error 'Unknown command name ' + name
            else
                args = ['', ''].concat ui.cli.rawArgs[4..], ['-h']
                ui.cli.categories[name].parse args