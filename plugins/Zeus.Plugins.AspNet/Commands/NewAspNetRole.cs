using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;
using Zeus.PowerShell;

namespace Zeus.Plugins.AspNet.Commands
{
    [Cmdlet(VerbsCommon.New, "AspNetRole")]
    public class NewAspNetRole : RoleCmdlet<AspNetRole>
    {
        [Parameter(Mandatory = false, Position = 1)]
        public override ScriptBlock Definition { get; set; }

        protected override AspNetRole CreateRole(string name)
        {
            return new AspNetRole(name);
        }
    }
}
