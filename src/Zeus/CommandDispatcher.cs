using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace Zeus
{
    using CommandGroup = Dictionary<string, Lazy<ICommand, ICommandMetadata>>;

    [Export(typeof(ICommandDispatcher))]
    public class CommandDispatcher : ICommandDispatcher
    {
        private Dictionary<string, CommandGroup> Commands { get; set; }
        private Logger Log { get; set; }

        [ImportingConstructor]
        public CommandDispatcher(ILoggingService logging, [ImportMany] IEnumerable<Lazy<ICommand, ICommandMetadata>> commands)
        {
            Log = logging.GetLogger("CommandDispatcher");

            Commands = commands
                .GroupBy(l => l.Metadata.Group)
                .ToDictionary(
                    g => g.Key,
                    g => g.ToDictionary(
                        l => l.Metadata.Name));

            Log.Debug(() => DumpCommands());
        }

        public void Dispatch(IEnumerable<string> args)
        {
            Debug.Assert(args.Any());

            // Check for a group with the first argument
            string groupOrName = args.First();
            CommandGroup group;
            if (Commands.TryGetValue(groupOrName, out group))
            {
                Dispatch(groupOrName, group, args.Skip(1));
            }
            else if (Commands.TryGetValue(String.Empty, out group))
            {
                // Use the empty group
                Dispatch(String.Empty, group, args);
            }
            else
            {
                Log.Error("Command not found: {0}", groupOrName);
            }
        }

        private void Dispatch(string groupName, CommandGroup group, IEnumerable<string> args)
        {
            string name = args.FirstOrDefault();
            if (String.IsNullOrEmpty(name))
            {
                Log.Error(
                    "Usage: {0}<{1}> ... options ...",
                    String.IsNullOrEmpty(groupName) ? String.Empty : (" " + groupName),
                    String.Join("|", group.Values.Select(l => l.Metadata.Name)));
                return;
            }
            Lazy<ICommand, ICommandMetadata> cmd;
            if (!group.TryGetValue(name, out cmd))
            {
                if (String.IsNullOrEmpty(groupName))
                {
                    Log.Error("No such command '{0}'", name);
                }
                else
                {
                    Log.Error("No such command '{0}' in group '{1}'", name, groupName);
                }
            }
            else
            {
                cmd.Value.Execute(args.Skip(1));
            }
        }

        private string DumpCommands()
        {
            return String.Join(Environment.NewLine, Commands.SelectMany(
                p => p.Value.Values.Select(l =>
                    String.Format(
                        "Loaded '{0}' command from {1}, {2}",
                        (String.IsNullOrEmpty(p.Key) ? "" : (p.Key + " ")) + l.Metadata.Name,
                        l.Value.GetType().FullName,
                        l.Value.GetType().Assembly.GetName().Name))));
        }
    }
}
