using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zeus.Infrastructure;

namespace Zeus.Commands
{
    [Command("env", "init", "Creates a Zeusspec file for a specific environment")]
    public class InitEnvCommand : CommandBase
    {
        [Argument("The name of the environment to create", order: 0, required: true)]
        public string Name { get; set; }

        [Option("The path in which to place the environment file")]
        public string OutputFile { get; set; }

        protected override void Execute()
        {
            if (String.IsNullOrEmpty(OutputFile))
            {
                OutputFile = Path.Combine(Environment.CurrentDirectory, Name + ".zeusspec");
            }
            Log.Info("Writing Environment file to {0}", OutputFile);

            var context = new ZeusContext(Environment.CurrentDirectory);
            var env = context.CreateEnvironment(Name);
        }
    }
}
