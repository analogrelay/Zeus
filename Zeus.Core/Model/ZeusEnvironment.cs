using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Core.Model
{
    public class ZeusEnvironment
    {
        public string Name { get; set; }
        public string ApplicationName { get; set; }
        public ZeusApplication Application { get; set; }
        public IList<Service> Services { get; private set; }

        public ZeusEnvironment()
        {
            Services = new List<Service>();
        }
    }
}
