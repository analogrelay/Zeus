using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cli.Arguments
{
    public class ArgumentToken : CommandLineToken
    {
        public string Value { get; private set; }

        public ArgumentToken(string value)
        {
            Value = value;
        }

        public override bool Equals(object obj)
        {
            ArgumentToken other = obj as ArgumentToken;
            return other != null && String.Equals(Value, other.Value, StringComparison.Ordinal);
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }

        public override string ToString()
        {
            return "<" + Value + ">";
        }
    }
}
