using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus
{
    public abstract class Role
    {
        public string Name { get; set; }

        protected Role() { }
        protected Role(string name)
        {
            Name = name;
        }
    }
}
