using System;
using System.Collections.Generic;
using System.Globalization;
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
            var app = new ServiceModel(Name);
            
            // Run the script block to collect roles
            var roles = Definition.Invoke();
            foreach (var role in roles.Select(p => p.BaseObject as Role).Where(r => r != null)) {
                WriteVerbose(String.Format(CultureInfo.CurrentCulture, Strings.FoundRole, role.GetType().Name, role.Name));
                app.Roles.Add(role);
            }

            WriteObject(app);
        }
    }
}
