using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Zeus
{
    public class Zeusfile
    {
        public string AppName { get; set; }
        public ZeusServiceCollection Services { get; private set; }
        
        public Zeusfile()
        {
            Services = new ZeusServiceCollection();
        }
    }
}
