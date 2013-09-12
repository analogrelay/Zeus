using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Internal.Web.Utils;

namespace Zeus
{
    public struct CommandName : IEquatable<CommandName>
    {
        public static readonly CommandName Empty = new CommandName();

        public string Group { get; private set; }
        public string Name { get; private set; }

        public CommandName(string name) : this()
        {
            Name = name;
        }

        public CommandName(string group, string name) : this(name)
        {
            Group = group;
        }

        public override bool Equals(object obj)
        {
            if (!(obj is CommandName))
            {
                return false;
            }
            CommandName other = (CommandName)obj;
            return Equals(other);
        }

        public override int GetHashCode()
        {
            return HashCodeCombiner
                .Start()
                .Add(Group.ToLowerInvariant())
                .Add(Name.ToLowerInvariant())
                .CombinedHash;
        }

        public bool Equals(CommandName other)
        {
            return String.Equals(other.Group, Group, StringComparison.OrdinalIgnoreCase) &&
                String.Equals(other.Name, Name, StringComparison.OrdinalIgnoreCase);
        }

        public override string ToString()
        {
            return String.Concat(
                Group ?? String.Empty,
                (String.IsNullOrEmpty(Group) ? String.Empty : " "),
                Name);
        }
    }
}
