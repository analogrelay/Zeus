using System;
using System.Collections.Generic;
using System.ComponentModel.Composition.Hosting;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.Config;
using Zeus.Infrastructure;

namespace Zeus
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Check the first arg for the debug helper
            TryLaunchDebugger(ref args);

            ConfigureLogging();

            CompositionContainer container = new CompositionContainer(
                new AssemblyCatalog(typeof(Program).Assembly));

            var manager = container.GetExportedValue<CommandManager>();

            // Invoke the root command
            manager.Invoke(args);
        }

        private static void RenderCommandTree(IEnumerable<CommandBase> commands, int indent = 0)
        {
            foreach (var command in commands)
            {
                Console.Write(new String(' ', indent));
                var group = command as CommandGroup;
                if (group != null)
                {
                    Console.Write("+ ");
                    Console.WriteLine(group.Name);
                    RenderCommandTree(group.Commands, indent + 1);
                }
                else
                {
                    Console.Write("- ");
                    Console.WriteLine(command.Name);
                }
            }
        }

        private static void ConfigureLogging()
        {
            var config = new LoggingConfiguration();
            
            var consoleTarget = new SnazzyConsoleTarget()
            {
                Layout = "${message}"
            };
            config.AddTarget("console", consoleTarget);

            config.LoggingRules.Add(new LoggingRule("*", LogLevel.Debug, consoleTarget));

            LogManager.Configuration = config;
        }

        [Conditional("DEBUG")]
        private static void TryLaunchDebugger(ref string[] args)
        {
            string arg = args.FirstOrDefault();
            if (!String.IsNullOrEmpty(arg) &&
               (String.Equals(arg, "dbg", StringComparison.OrdinalIgnoreCase) ||
                String.Equals(arg, "debug", StringComparison.OrdinalIgnoreCase)))
            {
                args = args.Skip(1).ToArray();
                Debugger.Launch();
            }
        }
    }
}
