using System;
using System.Reflection;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Infrastructure
{
    public abstract class CommandBase
    {
        private CommandAttribute _attr;

        public virtual string Name
        {
            get { return CommandAttribute.Name; }
        }

        public virtual string Description
        {
            get { return CommandAttribute.Description; }
        }

        public virtual string Group
        {
            get { return CommandAttribute.Group; }
        }

        protected virtual CommandAttribute CommandAttribute
        {
            get { return _attr ?? (_attr = GetCommandAttribute()); }
        }

        public abstract void Invoke(IEnumerable<string> args);

        protected virtual CommandAttribute GetCommandAttribute()
        {
            return GetType().GetCustomAttribute<CommandAttribute>() ?? new CommandAttribute();
        }
    }
}
