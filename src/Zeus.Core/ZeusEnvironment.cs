using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus
{
    public class ZeusEnvironment
    {
        public string Name { get; set; }
        public Dictionary<string, string> Settings { get; private set; }

        public ZeusEnvironment()
        {
            Name = String.Empty;
            Settings = new Dictionary<string, string>();
        }

        public ZeusEnvironment(string name, Zeusfile Zeusfile)
        {
            // TODO: Complete member initialization
            this.name = name;
            this.Zeusfile = Zeusfile;
        }
    }
}
