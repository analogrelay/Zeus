using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cli;

namespace Zeus
{
    public class Program : CommandLineApplication
    {
        static void Main(string[] args)
        {
            CommandLineApplication.Run<Program>(args);
        }
    }
}
