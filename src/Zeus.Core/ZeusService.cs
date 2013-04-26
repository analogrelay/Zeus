using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus
{
    public class ZeusService
    {
        public string Name { get; private set; }
        public string Type { get; private set; }
        public ConfigurationSettingCollection Settings { get; private set; }

        public ZeusService(string name, string type)
        {
            Name = name;
            Type = type;
            Settings = new ConfigurationSettingCollection();
        }
    }
}
