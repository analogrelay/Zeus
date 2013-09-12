using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.Config;

namespace Zeus
{
    [Export]
    public class CommandLineApplication
    {
        public IDictionary<CommandName, Command> AllCommands { get; private set; }
        public IDictionary<string, IList<Command>> CommandGroups { get; private set; }

        private Logger Log { get; set; }

        [ImportingConstructor]
        private CommandLineApplication([ImportMany] IEnumerable<Command> commands)
        {
            CommandGroups = commands
                .GroupBy(c => c.Name.Group)
                .ToDictionary(g => g.Key, g => (IList<Command>)g.ToList());
            AllCommands = commands
                .ToDictionary(c => c.Name);
            Log = LogManager.GetLogger("Zeus.CommandLineApplication");
        }

        public static CommandLineApplication Load()
        {
            // Set up composition
            CompositionContainer container = new CompositionContainer(
                new AssemblyCatalog(typeof(CommandLineApplication).Assembly));

            // Get the app and return it
            var app = container.GetExportedValue<CommandLineApplication>();
            return app;
        }

        public void Run(IEnumerable<string> args)
        {
            // Check the first arg for the debug helper
            TryLaunchDebugger(ref args);

            ConfigureLogging();
            try
            {
                Command toExecute = null;
                if (args.FirstOrDefault() == null)
                {
                    if (!AllCommands.TryGetValue(new CommandName("help"), out toExecute))
                    {
                        toExecute = new DefaultHelpCommand();
                    }
                }
                else
                {
                    // Now grab an argument
                    string groupOrCommandName = args.First();
                    args = args.Skip(1);

                    // Try to grab another
                    string commandName = args.FirstOrDefault();
                    CommandName actualCommandName;
                    if (String.IsNullOrEmpty(commandName) || commandName[0] == '/' || commandName[0] == '-')
                    {
                        // It's a switch or not present, so there is no 'group'
                        actualCommandName = new CommandName(groupOrCommandName);
                    }
                    else
                    {
                        actualCommandName = new CommandName(groupOrCommandName, commandName);
                    }

                    // Execute the command
                    toExecute = EnsureCommand(actualCommandName);
                }
                toExecute.Invoke(this);
            }
            catch (Exception ex)
            {
                Log.ErrorException(ex.Message, ex);
            }
        }

        private void ConfigureLogging()
        {
            LoggingConfiguration config = new LoggingConfiguration();

            var consoleTarget = new SnazzyConsoleTarget()
            {
                Layout = "${message}"
            };

            config.AddTarget("console", consoleTarget);
            config.LoggingRules.Add(new LoggingRule("*", LogLevel.Debug, consoleTarget));

            LogManager.Configuration = config;
        }

        private Command EnsureCommand(CommandName commandName)
        {
            Command cmd;
            if (!AllCommands.TryGetValue(commandName, out cmd))
            {
                throw new Exception(String.Format(CultureInfo.InvariantCulture, "Unknown command: {0}", commandName));
            }
            return cmd;
        }

        [Conditional("DEBUG")]
        private void TryLaunchDebugger(ref IEnumerable<string> args)
        {
            string arg = args.FirstOrDefault();
            if(!String.IsNullOrEmpty(arg) && 
               (String.Equals(arg, "dbg", StringComparison.OrdinalIgnoreCase) ||
                String.Equals(arg, "debug", StringComparison.OrdinalIgnoreCase)))
            {
                args = args.Skip(1);
                Debugger.Launch();
            }
        }
    }
}
