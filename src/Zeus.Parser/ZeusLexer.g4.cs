using System.IO;
using Antlr4.Runtime;
namespace Zeus.Parser
{
    partial class ZeusLexer
    {
        public ZeusLexer(TextReader reader) : this(new LatestAntlrInputStream(reader)) { }
    }
}
