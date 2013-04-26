using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;

namespace Zeus
{
    public class ConfigurationSettingCollection : KeyedCollection<string, ConfigurationSetting>
    {
        protected override string GetKeyForItem(ConfigurationSetting item)
        {
            return item.Name;
        }
    }
}
