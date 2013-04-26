using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Infrastructure
{
    [MetadataAttribute]
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class CommandAttribute : ExportAttribute, ICommandMetadata
    {
        public string Name { get; private set; }
        public string Group { get; private set; }
        public string Description { get; private set; }
        public string ArgumentNames { get; set; }

        public CommandAttribute(string name, string description)
            : base(typeof(ICommand))
        {
            Name = name;
            Description = description;
            Group = String.Empty;
        }

        public CommandAttribute(string group, string name, string description)
            : this(name, description)
        {
            if (group == null)
            {
                throw new ArgumentNullException("group");
            }

            Group = group;
        }
    }
}
