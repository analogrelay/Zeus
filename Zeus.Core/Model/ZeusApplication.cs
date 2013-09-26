using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Core.Model
{
    public class ZeusApplication
    {
        public string Name { get; set; }
        public IList<Role> Roles { get; private set; }

        public ZeusApplication()
        {
            Roles = new List<Role>();
        }
    }
}
