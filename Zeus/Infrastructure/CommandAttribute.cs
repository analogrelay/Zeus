using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;

namespace Zeus.Infrastructure
{
    public sealed class CommandAttribute : ExportAttribute
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public string Group { get; set; }

        internal CommandAttribute()
        {
            Name = String.Empty;
            Description = String.Empty;
            Group = String.Empty;
        }

        public CommandAttribute(string name)
            : this(name, String.Empty)
        {
        }

        public CommandAttribute(string name, string description)
            : base(typeof(CommandBase))
        {
            Name = name;
            Description = description;
            Group = String.Empty;
        }
    }
}
