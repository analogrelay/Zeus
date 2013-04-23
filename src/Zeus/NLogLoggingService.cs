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
        [ImportingConstructor]
        public NLogLoggingService()
        {
            InitializeLogging();
        }

        public Logger GetLogger(string name)
        {
            return LogManager.GetLogger(name);
        }

        private void InitializeLogging()
        {
            var config = new LoggingConfiguration();

            SnazzyConsoleTarget target = new SnazzyConsoleTarget()
            {
                Layout = "${message}"
            };
            config.AddTarget("console", target);

            LogLevel level = LogLevel.Info;
#if DEBUG
            level = LogLevel.Debug;
#endif
            LoggingRule rule = new LoggingRule("*", level, target);
            config.LoggingRules.Add(rule);

            LogManager.Configuration = config;
        }
    }
}
