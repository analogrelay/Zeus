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
        public string Name { get; set; }
        public string Group { get; set; }
        public string Description { get; set; }

        public CommandAttribute(string name, string description) : base(typeof(Command))
        {
            Name = name;
            Description = description;
        }

        public CommandAttribute(string group, string name, string description) : this(name, description)
        {
            Group = group;
        }
    }
}
