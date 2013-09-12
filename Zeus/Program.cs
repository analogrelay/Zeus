using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Check the first arg for the debug helper
            IEnumerable<string> arguments = args;
            TryLaunchDebugger(ref arguments);

            // Load the application
            var app = CommandLineApplication.Load();

            // Run it!
            app.Run(arguments);
        }

        [Conditional("DEBUG")]
        private static void TryLaunchDebugger(ref IEnumerable<string> args)
        {
            string arg = args.FirstOrDefault();
            if (!String.IsNullOrEmpty(arg) &&
               (String.Equals(arg, "dbg", StringComparison.OrdinalIgnoreCase) ||
                String.Equals(arg, "debug", StringComparison.OrdinalIgnoreCase)))
            {
                args = args.Skip(1);
                Debugger.Launch();
            }
        }
    }
}
