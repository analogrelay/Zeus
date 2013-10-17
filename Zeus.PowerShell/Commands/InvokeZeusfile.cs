using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.PowerShell.Commands
{
    [Cmdlet(VerbsLifecycle.Invoke, "Zeusfile", DefaultParameterSetName = "ScriptBlock")]
    public class InvokeZeusfile : PSCmdlet
    {
        [Parameter(Mandatory = true, ParameterSetName = "ScriptBlock", Position = 0)]
        public ScriptBlock ScriptBlock { get; set; }

        [Parameter(Mandatory = true, ParameterSetName = "Script", Position = 0, ValueFromPipeline = true)]
        public string Script { get; set; }

        protected override void BeginProcessing()
        {
            // Create a new runspace
            IList<PSObject> results;
            if (String.Equals(ParameterSetName, "ScriptBlock", StringComparison.OrdinalIgnoreCase))
            {
                Script = ScriptBlock.ToString();
            }
            using (var runspace = RunspaceHelper.CreateZeusfileRunspace(MyInvocation.MyCommand))
            {
                // Invoke the Zeusfile
                var pipeline = runspace.CreatePipeline();
                var cmd = new Command(Script, isScript: true);
                pipeline.Commands.Add(cmd);
                results = pipeline.Invoke();
            }
            WriteObject(results, enumerateCollection: true);
        }
    }
}
