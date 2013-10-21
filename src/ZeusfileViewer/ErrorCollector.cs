using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Antlr4.Runtime;

namespace ZeusfileViewer
{
    class ErrorCollector : BaseErrorListener
    {
        public IList<string> Errors { get; private set; }

        public ErrorCollector()
        {
            Errors = new List<string>();
        }

        public override void SyntaxError(IRecognizer recognizer, IToken offendingSymbol, int line, int charPositionInLine, string msg, RecognitionException e)
        {
            Errors.Add(String.Concat(new object[] { "line ", line, ":", charPositionInLine, " ", msg }));
        }
    }
}
