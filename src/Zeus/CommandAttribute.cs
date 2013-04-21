using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus
{
    [MetadataAttribute]
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class CommandAttribute : ExportAttribute, ICommandMetadata
    {
        public string Name { get; private set; }
        public string Group { get; private set; }

        public CommandAttribute(string name)
            : base(typeof(ICommand))
        {
            Name = name;
            Group = String.Empty;
        }

        public CommandAttribute(string name, string group)
            : this(name)
        {
            if (group == null)
            {
                throw new ArgumentNullException("group");
            }

            Group = group;
        }
    }
}
