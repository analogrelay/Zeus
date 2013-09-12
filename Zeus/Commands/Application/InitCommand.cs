using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Commands.Application
{
    public class InitCommand : Command
    {
        public override void Invoke()
        {
            Console.WriteLine("Init!");
        }
    }
}
