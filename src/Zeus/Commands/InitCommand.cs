using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fclp;
using NLog;

namespace Zeus.Commands
{
    [Command("init")]
    public class InitCommand : ICommand
    {
        public Logger Log { get; set; }

        [ImportingConstructor]
        public InitCommand(ILoggingService logging)
        {
            Log = logging.GetLogger("InitCommand");
        }

        public void Execute(IEnumerable<string> args)
        {
            Log.Debug("Running 'init' command.");

            // Create an empty Zeusfile
            Log.Info("Initializing an empty Zeusfile...");
            ZeusContext context = new ZeusContext(Environment.CurrentDirectory);
            context.SaveChanges();
        }
    }
}
