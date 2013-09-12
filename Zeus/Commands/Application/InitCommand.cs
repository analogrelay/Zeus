using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Commands.Application
{
    [Command(CommandGroups.App, "init", "Initializes a new Application")]
    public class InitCommand : Command
    {
        protected override void Execute()
        {
            Log.Info("Initializing a Zeus application...");
        }
    }
}
