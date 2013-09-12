using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Load the application
            var app = CommandLineApplication.Load();

            // Run it!
            app.Run(args);
        }
    }
}
