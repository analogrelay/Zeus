using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Arguments
{
    public abstract class ArgumentModel
    {
        private Action<object> _valueApplicator;

        public bool Required { get; set; }
        public string Description { get; set; }
        public Type Type { get; set; }
        public Action<object> ValueApplicator { get; set; }

        public ArgumentModel()
        {
        }

        public virtual void ApplyValue(object value)
        {
            if (ValueApplicator != null)
            {
                ValueApplicator(value);
            }
            else
            {
                throw new InvalidOperationException("Cannot apply value without a ValueApplicator");
            }
        }
    }

    public class NamedArgumentModel : ArgumentModel
    {
        public string Name { get; set; }
        public string AlternateName { get; set; }

        public NamedArgumentModel(string name, string alternateName)
        {
            Name = name;
            AlternateName = alternateName;
        }
    }

    public class PositionalArgumentModel : ArgumentModel
    {
        public int Position { get; set; }
        public PositionalArgumentModel(int position)
        {
            Position = position;
        }
    }
}
