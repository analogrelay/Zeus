using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Commander
{
    public class Tokenizer
    {
        private static readonly string[] _defaultSwitchPrefixes = new[] {
            "--",
            "-",
            "/"
        };

        public IEnumerable<string> SwitchPrefixes { get; private set; }

        public Tokenizer() : this(_defaultSwitchPrefixes) { }

        public Tokenizer(params string[] switchPrefixes)
        {
            SwitchPrefixes = switchPrefixes;
        }

        public IEnumerable<object> Tokenize(string[] args)
        {
            if (args == null)
            {
                throw new ArgumentNullException("args");
            }

            // Call an iterator method to do the actual parsing.
            return TokenizeCore(args);
        }

        
        private IEnumerable<object> TokenizeCore(string[] args)
        {
            yield break;
        }
    }
}
