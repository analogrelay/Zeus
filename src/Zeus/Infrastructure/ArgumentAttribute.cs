using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Infrastructure
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class ArgumentAttribute : Attribute
    {
        public int Order { get; private set; }
        public string Description { get; private set; }
        public bool Required { get; private set; }

        public ArgumentAttribute(string description, int order, bool required)
        {
            Description = description;
            Order = order;
            Required = required;
        }
    }
}
