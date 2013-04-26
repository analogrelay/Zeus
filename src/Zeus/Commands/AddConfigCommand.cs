using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zeus.Infrastructure;

namespace Zeus.Commands
{
    [Command("config", "add", "Adds a config setting to a Zeus service")]
    public class AddConfigCommand : CommandBase
    {
        [Argument("The service to add the config setting to", order: 0, required: true)]
        public string Service { get; set; }

        [Argument("The name of the config setting to add", order: 1, required: true)]
        public string Setting { get; set; }

        [Option("Specifies that the setting is optional", "opt", "o")]
        public bool Optional { get; set; }

        protected override void Execute()
        {
            Log.Info("Adding '{0}' to config for '{1}'", Setting, Service);

            // Create a Zeus Context
            var context = new ZeusContext(Environment.CurrentDirectory);

            // Get the service
            if (!context.Zeusfile.Services.Contains(Service))
            {
                Log.Error("There is no service named '{0}' in the Zeusfile", Service);
            }
            else
            {
                var service = context.Zeusfile.Services[Service];
                if (service.Settings.Contains(Setting))
                {
                    Log.Error("There is already a config setting named '{0}' in the '{1}' service", Setting, Service);
                }
                else
                {
                    service.Settings.Add(new ConfigurationSetting(Setting, !Optional));
                }
            }

            // Save changes
            context.SaveChanges();
        }
    }
}
