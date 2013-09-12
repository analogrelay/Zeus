using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using clipr;

namespace Zeus.Commands.Application
{
    public class ApplicationCommandGroup : CommandGroup
    {
        [Verb("init", "Initializes a new Zeus Application")]
        public InitCommand Init { get; set; }
    }
}
