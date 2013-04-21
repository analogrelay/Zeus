using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Core
{
    /// <summary>
    /// Represents the context for a zeus command.
    /// </summary>
    /// <remarks>
    /// Specifically this class represents the Zeusfile and Zeus Repositories being used.
    /// </remarks>
    public class ZeusContext
    {
        public string WorkingDirectory { get; private set; }

        public ZeusContext(string workingDirectory)
        {
            WorkingDirectory = workingDirectory;
        }
    }
}
