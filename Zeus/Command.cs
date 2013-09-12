using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using NLog;

namespace Zeus
{
    public abstract class Command
    {
        private Lazy<CommandAttribute> _attribute;
        private Lazy<CommandName> _name;

        public virtual CommandName Name { get { return _name.Value; } }
        public virtual string Description { get { return Attribute == null ? null : Attribute.Description; } }

        public Logger Log { get; set; }
        public CommandLineApplication App { get; set; }

        protected virtual CommandAttribute Attribute
        {
            get { return _attribute.Value; }
        }

        protected Command()
        {
            _attribute = new Lazy<CommandAttribute>(() => GetType().GetCustomAttribute<CommandAttribute>());
            _name = new Lazy<CommandName>(() =>
            {
                if (Attribute == null)
                {
                    return CommandName.Empty;
                }
                else
                {
                    return new CommandName(Attribute.Group, Attribute.Name);
                }
            });
        }

        public virtual void Invoke(CommandLineApplication app)
        {
            App = app;
            Log = LogManager.GetLogger(GetType().FullName);

            Execute();
        }

        protected abstract void Execute();
    }
}
