using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus
{
    public interface ICommandDispatcher
    {
        void Dispatch(string command, IEnumerable<string> args);
    }
}
