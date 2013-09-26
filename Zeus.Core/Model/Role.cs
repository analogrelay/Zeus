using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Core.Model
{
    public class Role
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public IList<ConfigurationNode> Configuration { get; private set; }

        public Role()
        {
            Configuration = new List<ConfigurationNode>();
        }
    }
}
