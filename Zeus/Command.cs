using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using NLog;
using clipr;
using clipr.Usage;
using Zeus.Arguments;

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

        public virtual void Invoke(CommandLineApplication app, IEnumerable<string> args)
        {
            App = app;
            Log = LogManager.GetLogger(GetType().FullName);

            BindArguments(args);

            Execute();
        }

        private void BindArguments(IEnumerable<string> args)
        {
            ArgumentModel model = GetArgumentModel();
        }

        private IEnumerable<ArgumentModel> GetArgumentModels()
        {
            var argumentProperties = from p in GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                     let attr = p.GetCustomAttribute<OptionAttribute>()
                                     where attr != null
                                     select Tuple.Create(p, attr);
            foreach (var argumentProperty in argumentProperties)
            {
                var prop = argumentProperty.Item1;
                var attr = argumentProperty.Item2;

                yield return attr.CreateModel(prop);
            }
        }

        protected abstract void Execute();
    }
}
