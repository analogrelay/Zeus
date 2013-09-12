using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using clipr;
using Zeus.Commands;
using Zeus.Commands.Application;

namespace Zeus
{
    public class Application : CommandGroup
    {
        [Verb("app", "Commands for managing Zeus applications")]
        public ApplicationCommandGroup App { get; set; }
    }
}
