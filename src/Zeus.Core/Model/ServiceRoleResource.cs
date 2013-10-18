using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Model
{
    public class ServiceRoleResource
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public IList<string> Flags { get; set; }
        public IList<ResourceConfigurationNode> Configuration { get; set; }
    }
}
