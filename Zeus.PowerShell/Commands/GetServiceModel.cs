using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Abstractions;
using System.Linq;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.PowerShell.Commands
{
    [Cmdlet(VerbsCommon.Get, "ServiceModel")]
    public class GetServiceModel : PSCmdlet
    {
        public IFileSystem FileSystem { get; private set; }

        public GetServiceModel() : this(new FileSystem()) { }
        public GetServiceModel(IFileSystem fileSystem)
        {
            FileSystem = fileSystem;
        }

        [Parameter(Mandatory = false, ValueFromPipeline = true)]
        public string Path { get; set; }

        protected override void ProcessRecord()
        {
            if (String.IsNullOrEmpty(Path))
            {
                Path = SessionState.Path.CurrentFileSystemLocation.Path;
            }

            // Check if this is a path to a zeusfile
            string zeusfile = Path;
            if (FileSystem.Directory.Exists(Path))
            {
                zeusfile = FileSystem.Path.Combine(Path, Constants.ZeusfileName);
            }

            string fileName = FileSystem.Path.GetFileName(zeusfile);
            if (!FileSystem.File.Exists(zeusfile))
            {
                throw new FileNotFoundException(String.Format(
                    CultureInfo.CurrentCulture,
                    Strings.ZeusfileNotFound,
                    zeusfile), zeusfile);
            }
            else if (!String.Equals(Constants.ZeusfileName, fileName, StringComparison.OrdinalIgnoreCase))
            {
                WriteWarning(String.Format(
                    CultureInfo.CurrentCulture,
                    Strings.ZeusfileHasNonDefaultName,
                    fileName));
            }

            // Ready! Build a service model by invoking the script and reading the return value
            var content = FileSystem.File.ReadAllText(zeusfile);

            // Create a new runspace
            IList<PSObject> results;
            using (var runspace = RunspaceHelper.CreateZeusfileRunspace(MyInvocation.MyCommand))
            {
                var pipeline = runspace.CreatePipeline();
                pipeline.Commands.AddScript(content);
                results = pipeline.Invoke();
            }
            
            // Read the results
            if (results.Count == 0)
            {
                throw new InvalidZeusfileException(
                    GetInvalidZeusfileMessage(zeusfile, Strings.InvalidZeusfile_Empty));
            }
            else if (results.Count > 1)
            {
                throw new InvalidZeusfileException(
                    GetInvalidZeusfileMessage(zeusfile, Strings.InvalidZeusfile_MultipleResults));
            }

            var service = results[0].BaseObject as ServiceModel;
            if (service == null)
            {
                throw new InvalidZeusfileException(
                    GetInvalidZeusfileMessage(zeusfile, Strings.InvalidZeusfile_InvalidResultType));
            }
            WriteObject(service);
        }

        private string GetInvalidZeusfileMessage(string zeusfile, string format, params object[] args)
        {
            return String.Concat(
                String.Format(format, args),
                Environment.NewLine,
                String.Format(CultureInfo.CurrentCulture, Strings.InvalidZeusfile, zeusfile));
        }
    }
}
