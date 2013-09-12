using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus
{
    public class DefaultHelpCommand : Command
    {
        private static readonly CommandName _helpCommandName = new CommandName("help");
        public override CommandName Name
        {
            get
            {
                return _helpCommandName;
            }
        }

        public override string Description
        {
            get
            {
                return "Displays a help message listing all commands, or specific help for a command";
            }
        }

        protected override void Execute()
        {
            Log.Warn("Not Yet Implemented!");
        }
    }
}
