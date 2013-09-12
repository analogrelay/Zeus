using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using clipr;

namespace Zeus.Commands
{
    public abstract class CommandGroup : ICommand
    {
        public void Invoke()
        {
            var props = from p in GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public)
                        where p.GetCustomAttribute<VerbAttribute>() != null
                        select p;
            foreach (var prop in props)
            {
                ICommand cmd = prop.GetValue(this) as ICommand;
                if (cmd != null)
                {
                    cmd.Invoke();
                    return;
                }
            }
            Console.WriteLine("{0} HALP!", GetType().Name);
        }
    }
}
