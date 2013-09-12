using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using clipr;

namespace Zeus
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Check the first arg for the debug helper
            TryLaunchDebugger(ref args);

            var opts = new Application();
            var parser = new CliParser<Application>(opts);
            if (parser.TryParse(args))
            {
                opts.Invoke();
            }
            else
            {
                Console.WriteLine("HALP!");
            }
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
