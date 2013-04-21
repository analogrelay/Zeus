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
    public class CommandAttribute : ExportAttribute
    {
        public string Name { get; private set; }

        public CommandAttribute(string name)
            : base(typeof(ICommand))
        {
            Name = name;
        }
    }
}
