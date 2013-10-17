using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Plugins.AspNet
{
    public class AspNetRole : Role
    {
        public AspNetRole(string name) : base(name) { }

        public override string ToString()
        {
            return "ASP.Net: " + Name;
        }
    }
}
