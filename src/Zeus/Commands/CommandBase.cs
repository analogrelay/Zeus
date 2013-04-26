using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.Composition;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using NDesk.Options;
using NLog;
using Zeus.Infrastructure;

namespace Zeus.Commands
{
    public abstract class CommandBase : ICommand
    {
        protected Logger Log { get; private set; }
        protected IEnumerable<string> FullArguments { get; private set; }

        [ImportingConstructor]
        public CommandBase(ILoggingService loggingService)
        {
            Log = loggingService.GetLogger(GetType().Name);
        }

        public void Execute(IEnumerable<string> args)
        {
            FullArguments = args.ToArray();
            var desc = Describe();
            var optionSet = GetOptionSet(desc.Options);
            IEnumerable<string> arguments = null;
            try
            {
                arguments = optionSet.Parse(args);
            }
            catch (OptionException optex)
            {
                Log.Error(optex.Message);
                DisplayHelp(desc, optionSet);
            }
            if (arguments != null)
            {
                if (ParseArguments(desc.Arguments, arguments))
                {
                    Execute();
                }
                else
                {
                    DisplayHelp(desc, optionSet);
                }
            }
        }

        public void DisplayHelp()
        {
            var desc = Describe();
            var set = GetOptionSet(desc.Options);
            DisplayHelp(desc, set);
        }

        private void DisplayHelp(CommandDescription desc, OptionSet options)
        {
            Log.Info("Usage: {0} [options] {1}",
                String.IsNullOrEmpty(desc.Group) ? desc.Name : (desc.Group + " " + desc.Name),
                String.Join(" ", desc.Arguments.Select(arg => arg.Metadata.Required ? ("<" + arg.Name + ">") : ("[" + arg.Name + "]"))));

            int longestArg = desc.Arguments.Select(arg => arg.Name.Length).Max() + 4;
            foreach (var arg in desc.Arguments)
            {
                Log.Info("  {0} {1}", arg.Name.PadRight(longestArg), arg.Metadata.Description);
            }

            if (desc.Options.Any())
            {
                Log.Info(" ");
                Log.Info("Options: ");

                StringBuilder description = new StringBuilder();
                using (StringWriter writer = new StringWriter(description))
                {
                    options.WriteOptionDescriptions(writer);
                }
                foreach (var line in description.ToString().Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries))
                {
                    Log.Info(line);
                }
            }
        }

        protected abstract void Execute();

        protected virtual CommandDescription Describe()
        {
            var options =
                (from property in GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public)
                 where property.CanWrite
                 let optionAttribute = property.GetCustomAttribute<OptionAttribute>()
                 where optionAttribute != null
                 let nameAttribute = property.GetCustomAttribute<DisplayNameAttribute>()
                 select new OptionDescription(
                     nameAttribute == null ? property.Name : nameAttribute.DisplayName,
                     optionAttribute,
                     property))
                 .ToList();

            var args =
                (from property in GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public)
                 where property.CanWrite
                 let argAttribute = property.GetCustomAttribute<ArgumentAttribute>()
                 where argAttribute != null
                 orderby argAttribute.Order descending
                 let nameAttribute = property.GetCustomAttribute<DisplayNameAttribute>()
                 select new ArgumentDescription(
                     nameAttribute == null ? property.Name : nameAttribute.DisplayName,
                     argAttribute,
                     property))
                 .ToList();
            if (args.SkipWhile(a => a.Metadata.Required).Any(a => a.Metadata.Required))
            {
                throw new InvalidOperationException("Required Arguments must come before optional arguments.");
            }

            CommandAttribute attr = GetType().GetCustomAttribute<CommandAttribute>();

            return new CommandDescription(attr.Name, attr.Group, attr.Description, args, options);
        }

        private bool ParseArguments(IList<ArgumentDescription> descs, IEnumerable<string> args)
        {
            var argQueue = new Queue<string>(args);
            foreach (var desc in descs)
            {
                // Try to dequeue an argument
                if (argQueue.Count > 0)
                {
                    ApplyArgument(desc, argQueue.Dequeue());
                }
                else if (desc.Metadata.Required)
                {
                    Log.Error("Missing argument: '{0}'", desc.Name);
                    return false;
                }
            }
            if (argQueue.Count > 0)
            {
                Log.Warn("Unused arguments: {0}", String.Join(",", argQueue));
            }
            return true;
        }

        private void ApplyArgument(ArgumentDescription desc, string value)
        {
            if (desc.Property.PropertyType != typeof(string))
            {
                throw new InvalidOperationException(String.Format("Error applying {0} argument. Only string arguments are supported at the moment", desc.Name));
            }
            desc.Property.SetValue(this, value);
        }

        private OptionSet GetOptionSet(IEnumerable<OptionDescription> options)
        {
            var set = new OptionSet();
            foreach (var option in options)
            {
                // Build a prototype
                string prototype = String.Join("|",
                    option.Property.Name,
                    option.Metadata.AltNames);
                if (option.Property.PropertyType != typeof(bool))
                {
                    prototype += "=";
                }

                // Compile a delegate
                var param = Expression.Parameter(typeof(string));
                var action = Expression.Lambda<Action<string>>(
                    Expression.Assign(
                        Expression.Property(
                            Expression.Constant(this),
                            option.Property),
                        param),
                    param).Compile();

                // Add the option
                set.Add(prototype, action);
            }
            return set;
        }
    }
}
