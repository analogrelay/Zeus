using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cli.Arguments
{
    public class SwitchToken : CommandLineToken
    {
        public string Name { get; private set; }
        public bool Value { get; private set; }

        public SwitchToken(string name, bool value)
        {
            Name = name;
            Value = value;
        }

        public override bool Equals(object obj)
        {
            SwitchToken other = obj as SwitchToken;
            return other != null && String.Equals(Name, other.Name, StringComparison.Ordinal) && Value == other.Value;
        }

        public override int GetHashCode()
        {
            return Name.GetHashCode();
        }

        public override string ToString()
        {
            return "<" + Name + "=" + Value.ToString() + ">";
        }
    }
}
