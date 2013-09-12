using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Commands
{
    public abstract class Command : ICommand
    {
        public abstract void Invoke();
    }
}
