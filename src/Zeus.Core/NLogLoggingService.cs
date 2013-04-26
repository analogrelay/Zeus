using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.Config;

namespace Zeus
{
    [Export(typeof(ILoggingService))]
    public class NLogLoggingService : ILoggingService
    {
        public Logger GetLogger(string name)
        {
            return LogManager.GetLogger(name);
        }
    }
}
