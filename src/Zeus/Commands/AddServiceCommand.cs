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
    [Command("service", "add", "Adds a service to an existing Zeusfile")]
    public class AddServiceCommand : CommandBase
    {
        [Argument("The name of the service to add", order: 0, required: true)]
        public string Name { get; set; }

        [Argument("The type of the service to add", order: 1, required: true)]
        public string Type { get; set; }

        protected override void Execute()
        {
            Log.Info("Adding {0} service named {1} to Zeusfile", Type, Name);

            // Create a Zeus Context
            var context = new ZeusContext(Environment.CurrentDirectory);

            // Add a service to the zeusfile
            if (context.Zeusfile.Services.Contains(Name))
            {
                Log.Error("There is already a service named '{0}' in the Zeusfile", Name);
            }
            else
            {
                context.Zeusfile.Services.Add(new ZeusService(Name, Type));

                // Save the file
                context.SaveChanges();
            }
        }
    }
}
