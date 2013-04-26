using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using Zeus.Infrastructure;

namespace Zeus.Commands
{
    [Command("init", "Initializes a new Zeusfile in the current directory", ArgumentNames = "name")]
    public class InitCommand : CommandBase
    {
        [Argument("The name of the application that this Zeusfile will be for", order: 0, required: true)]
        public string AppName { get; set; }

        [ImportingConstructor]
        public InitCommand(ILoggingService log) : base(log) { }

        protected override void Execute()
        {
            Log.Info("Creating Zeusfile for '{0}'", AppName);

            // Create an empty Zeusfile
            ZeusContext context = new ZeusContext(Environment.CurrentDirectory);
            context.Zeusfile.AppName = AppName;
            context.SaveChanges();
        }
    }
}
