using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fclp;
using NLog;

namespace Zeus.Commands
{
    [Command(name: "list", group: "service")]
    public class ListServicesCommand : ICommand
    {
        public Logger Log { get; set; }

        public string Name { get; set; }
        public string Type { get; set; }

        [ImportingConstructor]
        public ListServicesCommand(ILoggingService logging)
        {
            Log = logging.GetLogger("AddService");
        }

        public void Execute(IEnumerable<string> args)
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
