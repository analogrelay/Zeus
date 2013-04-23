using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Zeus
{
    public class ZeusServiceCollection : KeyedCollection<string, ZeusService>
    {
        protected override string GetKeyForItem(ZeusService item)
        {
            return item.Name;
        }
    }
}
