using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cli
{
    public abstract class CommandLineApplication
    {
        public static void Run<T>(string[] args) where T : CommandLineApplication, new()
        {
            
        }

        public virtual IEnumerable<Type> GetCommands()
        {
            return DiscoverCommands();
        }

        private IEnumerable<Type> DiscoverCommands()
        {
            return GetType()
                .Assembly
                .GetExportedTypes()
                .Where(t => t.GetInterfaces().Contains(typeof(ICommand)));
        }
    }
}
