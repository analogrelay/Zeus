using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.PowerShell
{
    public abstract class RoleCmdlet<TRole> : PSCmdlet where TRole : Role
    {
        [Parameter(Mandatory = true, Position = 0)]
        public string Name { get; set; }
        public abstract ScriptBlock Definition { get; set; }

        protected override void ProcessRecord()
        {
            var role = CreateRole(Name);
            // TODO: Execute Definition
            WriteObject(role);
        }

        protected abstract TRole CreateRole(string name);
    }
}
