using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cli.Arguments
{
    public class ParameterToken : CommandLineToken
    {
        public string Name { get; private set; }
        public string Value { get; private set; }

        public ParameterToken(string name, string value)
        {
            Name = name;
            Value = value;
        }

        public override bool Equals(object obj)
        {
            ParameterToken other = obj as ParameterToken;
            return other != null && 
                String.Equals(Name, other.Name, StringComparison.Ordinal) && 
                String.Equals(Value, other.Value, StringComparison.Ordinal);
        }

        public override int GetHashCode()
        {
            return ToString().GetHashCode();
        }

        public override string ToString()
        {
            return "<" + Name + "=" + Value + ">";
        }
    }
}
