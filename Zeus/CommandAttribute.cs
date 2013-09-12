using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;

namespace Zeus
{
    [MetadataAttribute]
    public class CommandAttribute : ExportAttribute
    {
        public CommandName Name { get; set; }
        public string Description { get; set; }

        private CommandAttribute(CommandName name, string description)
        {
            Name = name;
            Description = description;
        }

        public CommandAttribute(string name, string description) : this(new CommandName(name), description)
        {
        }

        public CommandAttribute(string group, string name, string description) : this(new CommandName(group, name), description)
        {
        }
    }
}
