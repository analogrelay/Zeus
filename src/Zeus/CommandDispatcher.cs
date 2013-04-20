using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace Zeus
{
    [Export(typeof(ICommandDispatcher))]
    public class CommandDispatcher : ICommandDispatcher
    {
        private Logger Log { get; set; }

        [ImportingConstructor]
        public CommandDispatcher(ILoggingService logging)
        {
            Log = logging.GetLogger("CommandDispatcher");
        }

        public void Dispatch(string command, IEnumerable<string> args)
        {
            Log.Debug("Dispatching command: {0}", command);
        }
    }
}
