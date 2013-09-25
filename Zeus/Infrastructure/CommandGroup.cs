using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Infrastructure
{
    public abstract class CommandGroup : CommandBase
    {
        public IList<CommandBase> Commands { get; internal set; }

        public override void Invoke(IEnumerable<string> args)
        {
            string arg = args.FirstOrDefault();
            args = args.Skip(1);
            if (String.IsNullOrEmpty(arg) || arg[0] == '-' || arg[1] == '/')
            {
                WriteUsage();
            }
            else
            {
                var command = Commands.FirstOrDefault(c => String.Equals(c.Name, arg, StringComparison.OrdinalIgnoreCase));
                if (command != null)
                {
                    command.Invoke(args);
                }
                else
                {
                    WriteUsage();
                }
            }
        }

        private void WriteUsage()
        {
            Console.WriteLine("{0} HALP!", GetType().Name);
        }
    }
}
