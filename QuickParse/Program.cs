using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Antlr4.Runtime;
using Zeus.Parser;

namespace QuickParse
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length > 0 && args[0] == "dbg")
            {
                args = args.Skip(1).ToArray();
                Debugger.Launch();
            }

            if (args.Length != 1)
            {
                Console.WriteLine("Usage: QuickParse <file>");
            }
            else if (!File.Exists(args[0]))
            {
                Console.WriteLine("File does not exist: " + args[0]);
            }
            else
            {
                using (var rdr = new StreamReader(args[0]))
                {
                    ZeusLexer lex = new ZeusLexer(rdr);
                    IToken token;
                    while((token = lex.NextToken()).Type != ZeusLexer.Eof)
                    {
                        WriteToken(token);
                    }
                }
            }
        }

        private static void WriteToken(IToken token)
        {
            var text = "";
            if ((token.Type != ZeusLexer.INDENT) && (token.Type != ZeusLexer.DEDENT))
            {
                text = token.Text;
            }

            Console.WriteLine("{0} [{1}] @ ({2},{3},{4}):{5}", 
                ZeusLexer.tokenNames[token.Type], 
                text.Replace("\r", "\\r").Replace("\n", "\\n"), 
                token.Line, 
                token.Column, 
                token.StartIndex, 
                text.Length);
        }
    }
}
