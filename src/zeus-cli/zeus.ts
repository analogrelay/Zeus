import program = require('commander');
import fs = require('fs');

var winston = global.require('winston');

var log = new winston.Logger({
    transports: [
        new winston.transports.Console({ level: 'info' })
    ]
});

program
    .version('0.0.1')
    .option('-Z, --zeus-dir <path>', 'change the zeus root directory')
    .option('-v, --verbose', 'be more verbose', function () {
        log.transports.console.level = 'debug';
    });

// Load commands
    
program
    .command('init')
    .description('initializes an empty Zeusfile in the current directory')
    .action(function (options) {
        var zd = process.cwd();
        if (this.zeusDir) {
            zd = this.zeusDir;
        }
        console.log('zeus dir = ' + zd);
    });

program.parse(process.argv);

program.help();