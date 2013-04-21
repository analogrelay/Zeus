using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace Zeus
{
    [Export(typeof(ICommandDispatcher))]
    public class CommandDispatcher : ICommandDispatcher
    {
        private Dictionary<string, Lazy<ICommand, ICommandMetadata>> Commands { get; set; }
        private Logger Log { get; set; }

        [ImportingConstructor]
        public CommandDispatcher(ILoggingService logging, [ImportMany] IEnumerable<Lazy<ICommand, ICommandMetadata>> commands)
        {
            Log = logging.GetLogger("CommandDispatcher");
            Commands = commands.ToDictionary(cmd => cmd.Metadata.Name, StringComparer.OrdinalIgnoreCase);

            Log.Debug(() => DumpCommands());
        }

        public void Dispatch(string command, IEnumerable<string> args)
        {
            Lazy<ICommand, ICommandMetadata> cmd;
            if (!Commands.TryGetValue(command, out cmd))
            {
                Log.Error("Unknown command: {0}", command);
            }
            else
            {
                try
                {
                    cmd.Value.Execute(args);
                }
                catch (Exception ex)
                {
                    Log.ErrorException("Error executing command", ex);
                }
            }
        }

        private string DumpCommands()
        {
            return String.Join(Environment.NewLine, Commands.Values.Select(l => 
                String.Format("Loaded '{0}' command from {1}, {2}", l.Metadata.Name, l.Value.GetType().FullName, l.Value.GetType().Assembly.GetName().Name)));
        }
    }
}
