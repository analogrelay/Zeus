using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Zeus.Infrastructure;

namespace Zeus
{
    public class CommandDescription
    {
        public string Name { get; private set; }
        public string Group { get; private set; }
        public string Description { get; private set; }
        public IList<ArgumentDescription> Arguments { get; private set; }
        public IList<OptionDescription> Options { get; private set; }

        public CommandDescription(string name, string group, string description, IList<ArgumentDescription> arguments, IList<OptionDescription> options)
        {
            Name = name;
            Group = group;
            Description = description;
            Arguments = arguments;
            Options = options;
        }
    }

    public class ArgumentDescription
    {
        public string Name { get; private set; }
        public ArgumentAttribute Metadata { get; private set; }
        public PropertyInfo Property { get; private set; }

        public ArgumentDescription(string name, ArgumentAttribute metadata, PropertyInfo property)
        {
            Name = name;
            Metadata = metadata;
            Property = property;
        }
    }

    public class OptionDescription
    {
        public string Name { get; private set; }
        public OptionAttribute Metadata { get; private set; }
        public PropertyInfo Property { get; private set; }

        public OptionDescription(string name, OptionAttribute metadata, PropertyInfo property)
        {
            Name = name;
            Metadata = metadata;
            Property = property;
        }
    }
}
