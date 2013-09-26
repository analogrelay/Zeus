using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Core.Model
{
    public class ConfigurationGroup : ConfigurationNode
    {
        public IList<ConfigurationNode> Children { get; private set; }

        public ConfigurationGroup()
        {
            Children = new List<ConfigurationNode>();
        }
    }
}
