using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Infrastructure
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class OptionAttribute : Attribute
    {
        public string Description { get; private set; }
        public string[] AltNames { get; private set; }

        public OptionAttribute(string description) : this(description, new string[0])
        {
        }

        public OptionAttribute(string description, params string[] altNames)
        {
            Description = description;
            AltNames = altNames;
        }
    }
}
