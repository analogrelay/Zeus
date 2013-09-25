using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zeus.Infrastructure;

namespace Zeus.Commands.App
{
    [CommandAttribute("init", "Initializes a new application", Group = "app")]
    public class AppInitCommand : Command
    {
        public override void Invoke(IEnumerable<string> args)
        {
            Console.WriteLine("app init!!");
        }
    }
}
