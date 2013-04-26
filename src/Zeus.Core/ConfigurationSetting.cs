using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus
{
    public class ConfigurationSetting
    {
        public string Name { get; private set; }
        public bool Required { get; private set; }

        public ConfigurationSetting(string name, bool required)
        {
            Name = name;
            Required = required;
        }
    }
}
