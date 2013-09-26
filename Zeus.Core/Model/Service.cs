using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Core.Model
{
    public class Service
    {
        public string Name { get; set; }
        public string RoleName { get; set; }
        public string Type { get; set; }
        public Role Role { get; set; }
        public IList<ConfigurationNode> Configuration { get; private set; }

        public Service()
        {
            Configuration = new List<ConfigurationNode>();
        }
    }
}
