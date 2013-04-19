using System;
using System.Reflection;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.Config;

namespace Zeus
{
    [Export]
    public class Program
    {
        static void Main(string[] args)
        {
            var program = CompositionManager.Compose<Program>();
            program.Run(args);
        }

        private void Run(string[] args)
        {
            // Set up Debugging
            TryLaunchDebugger(ref args);

            // Set up Logging
            InitializeLogging();
            var mainLogger = LogManager.GetLogger("Program");

            mainLogger.Trace("Started Zeus v{0}", typeof(Program).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion);

            // Use the first arg to dispatch the command
            if (args.Length == 0)
            {
                mainLogger.Error("No arguments specified! TODO: Help!");
            }
            else
            {
                mainLogger.Debug("Dispatching Command: {0}", args[0]);
            }
        }

        private void InitializeLogging()
        {
            var config = new LoggingConfiguration();

            SnazzyConsoleTarget target = new SnazzyConsoleTarget()
            {
                Layout = "${message}"
            };
            config.AddTarget("console", target);

            LogLevel level = LogLevel.Info;
#if DEBUG
            level = LogLevel.Debug;
#endif
            LoggingRule rule = new LoggingRule("*", level, target);
            config.LoggingRules.Add(rule);

            LogManager.Configuration = config;
        }

        [Conditional("DEBUG")]
        private void TryLaunchDebugger(ref string[] args)
        {
            if (args.Length > 0 && String.Equals(args[0], "dbg", StringComparison.OrdinalIgnoreCase))
            {
                args = args.Skip(1).ToArray();
                Debugger.Launch();
            }
        }
    }
}
