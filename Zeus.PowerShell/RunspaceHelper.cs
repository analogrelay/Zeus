using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation;
using System.Management.Automation.Host;
using System.Management.Automation.Runspaces;
using System.Text;
using System.Threading.Tasks;
using Microsoft.PowerShell.Commands;

namespace Zeus.PowerShell
{
    internal static class RunspaceHelper
    {
        internal static Runspace CreateZeusfileRunspace(CommandInfo caller)
        {
            // Find the nested module
            var nested = Path.Combine(Path.GetDirectoryName(caller.Module.Path), "Zeusfile", "Zeus.PowerShell.Zeusfile.psd1");
            InitialSessionState session = InitialSessionState.Create(); // Create an empty session
#if DEBUG
            session.Commands.Add(new SessionStateCmdletEntry("Get-Command", typeof(GetCommandCommand), ""));
#endif
            session.Commands.Add(new SessionStateCmdletEntry("Set-Alias", typeof(SetAliasCommand), ""));
            session.Commands.Add(new SessionStateCmdletEntry("Get-Alias", typeof(SetAliasCommand), ""));
            session.Commands.Add(new SessionStateCmdletEntry("Export-ModuleMember", typeof(ExportModuleMemberCommand), ""));
            session.Commands.Add(new SessionStateCmdletEntry("Import-Module", typeof(ImportModuleCommand), ""));
            session.ImportPSModule(new [] { nested });
            session.LanguageMode = PSLanguageMode.FullLanguage;
            var runspace = RunspaceFactory.CreateRunspace(session);
            runspace.Open();
            return runspace;
        }
    }
}
