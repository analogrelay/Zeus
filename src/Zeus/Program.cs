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
        public ICommandDispatcher Dispatcher { get; protected set; }
        
        private Logger Log { get; set; }

        [ImportingConstructor]
        public Program(ILoggingService logging, ICommandDispatcher dispatcher)
        {
            Dispatcher = dispatcher;
            Log = logging.GetLogger(typeof(Program).Name);
        }

        static void Main(string[] args)
        {
            var program = CompositionManager.Compose<Program>();
            program.Run(args);
        }

        private void Run(string[] args)
        {
            // Set up Debugging
            TryLaunchDebugger(ref args);

            Log.Trace("Started Zeus v{0}", typeof(Program).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion);

            // Use the first arg to dispatch the command
            if (args.Length == 0)
            {
                Log.Error("No arguments specified! TODO: Help!");
            }
            else
            {
                Dispatcher.Dispatch(args[0], args.Skip(1));
            }
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
