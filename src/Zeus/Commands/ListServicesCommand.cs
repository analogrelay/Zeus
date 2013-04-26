using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using Zeus.Infrastructure;

namespace Zeus.Commands
{
    [Command("service", "list")]
    public class ListServicesCommand : CommandBase
    {
        public string Name { get; set; }
        public string Type { get; set; }

        [ImportingConstructor]
        public ListServicesCommand(ILoggingService log) : base(log) { }

        protected override void Execute()
        {
            // Create a Zeus Context
            var context = new ZeusContext(Environment.CurrentDirectory);

            // List services
            Log.Info("Services in the current Zeusfile:");
            foreach (var service in context.Zeusfile.Services)
            {
                Log.Info(" - {0} service: {1}", service.Type, service.Name);
            }
        }
    }
}
