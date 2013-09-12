using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Arguments
{
    public abstract class OptionAttribute : Attribute
    {
        public string Description { get; set; }

        protected OptionAttribute(string description)
        {
            Description = description;
        }

        public virtual ArgumentModel CreateModel(PropertyInfo property)
        {
            var model = CreateCoreModel(property);
            model.Description = Description;
            return model;
        }

        protected abstract ArgumentModel CreateCoreModel(PropertyInfo property);
    }

    [AttributeUsage(AttributeTargets.Property)]
    public class PositionalOptionAttribute : OptionAttribute
    {
        public int Position { get; }

        public PositionalOptionAttribute(int position, string description)
            : base(description)
        {

        }

        protected override ArgumentModel CreateCoreModel(PropertyInfo property)
        {
            return new PositionalArgumentModel(Position)
        }
    }

    [AttributeUsage(AttributeTargets.Property)]
    public class NamedOptionAttribute : OptionAttribute
    {
        public string Name { get; set; }
        public string AlternateName { get; }

        public NamedOptionAttribute(string description)
            : base(description)
        {

        }

        public NamedOptionAttribute(string alternateName, string description)
            : base(description)
        {
            AlternateName = alternateName;
        }

        protected override ArgumentModel CreateCoreModel(PropertyInfo property)
        {
            return new NamedArgumentModel(Name ?? property.Name, AlternateName)
        }
    }
}
