using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.PowerShell.Zeusfile.Commands
{
    [Cmdlet(VerbsCommon.New, "Application")]
    public class NewApplication : PSCmdlet
    {
        [Parameter(Mandatory = true, Position = 0)]
        public string Name { get; set; }

        [Parameter(Mandatory = false, Position = 1)]
        public ScriptBlock Definition { get; set; }

        protected override void ProcessRecord()
        {
            WriteObject(new ServiceModel(Name));
        }
    }
}
