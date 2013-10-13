using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.PowerShell
{
    internal static class RunspaceHelper
    {
        internal static Runspace CreateZeusfileRunspace(CommandInfo caller)
        {
            // Find the nested module
            var nested = Path.Combine(Path.GetDirectoryName(caller.Module.Path), "Zeusfile", "Zeus.PowerShell.Zeusfile.psd1");
            InitialSessionState session = InitialSessionState.CreateDefault();
            session.ImportPSModule(new [] { nested });
            var runspace = RunspaceFactory.CreateRunspace(session);
            runspace.Open();
            return runspace;
        }
    }
}
