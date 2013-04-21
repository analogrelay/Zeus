using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fclp;
using NLog;
using Zeus.Core;
using Zeus.Core.Serialization;

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
            Zeusfile file = new Zeusfile();

            // Just save it to the working directory
            string zeusfilePath = Path.Combine(Environment.CurrentDirectory, "Zeusfile");
            Log.Info("Saving it to {0}...", zeusfilePath);
            ZeusfileJsonSerializer serializer = new ZeusfileJsonSerializer();
            serializer.Write(file, zeusfilePath);
        }
    }
}
