using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Infrastructure
{
    [Export]
    public class CommandManager
    {
        public CommandGroup Commands { get; private set; }

        [ImportingConstructor]
        public CommandManager([ImportMany] IEnumerable<CommandBase> commands)
        {
            // Build the tree
            Commands = new RootCommandGroup(BuildCommandTree(String.Empty, commands).ToList());
        }

        public void Invoke(IEnumerable<string> args)
        {
            Commands.Invoke(args);
        }

        private IEnumerable<CommandBase> BuildCommandTree(string prefix, IEnumerable<CommandBase> commands, int depth = 0)
        {
            // Check for a command with the prefix as the name
            foreach (var command in commands.Where(c => String.Equals(c.Group ?? String.Empty, prefix, StringComparison.OrdinalIgnoreCase)))
            {
                // Now check if it's a group
                CommandGroup commandGroup = command as CommandGroup;
                if (commandGroup != null)
                {
                    string fullName = prefix.Length == 0 ? commandGroup.Name : (prefix + " " + commandGroup.Name);

                    // Now find sub commands
                    var subcommands = from c in commands
                                      let segment = String.IsNullOrEmpty(c.Group) ? null : c.Group.Split().Skip(depth).FirstOrDefault()
                                      where segment != null && String.Equals(segment, commandGroup.Name, StringComparison.OrdinalIgnoreCase)
                                      select c;
                    commandGroup.Commands = BuildCommandTree(fullName, subcommands, depth + 1).ToList();
                }

                yield return command;
            }
        }

        private class RootCommandGroup : CommandGroup
        {
            public override string Name { get { return String.Empty; } }
            public override string Description { get { return String.Empty; } }
            public override string Group { get { return String.Empty; } }
            
            public RootCommandGroup(IList<CommandBase> commands)
            {
                Commands = commands;
            }
        }
    }
}
