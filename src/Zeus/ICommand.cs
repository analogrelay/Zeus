using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus
{
    public interface ICommand
    {
        void Execute(IEnumerable<string> args);
    }
}
