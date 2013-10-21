using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Antlr4.Runtime;

namespace ZeusfileViewer
{
    public class Token
    {
        public string Type { get; private set; }
        public string Value { get; private set; }
        public int Line { get; private set; }
        public int Column { get; private set; }
        public int Index { get; private set; }

        public Token(string type, string value)
        {
            Type = type;
            Value = value;
        }

        public Token(IToken token)
        {
            try
            {
                Lexer l = token.TokenSource as Lexer;
                Type = "<<UNKNOWN:" + token.Type + ">>";
                if (l != null)
                {
                    Type = token.Type == -1 ? "<<EOF>>" : l.TokenNames[token.Type];
                }

                Value = token.Text.Replace("\r", "\\r").Replace("\n", "\\n").Replace("\t","\\t");
                Line = token.Line;
                Column = token.Column;
                Index = token.StartIndex;
            }
            catch (Exception ex)
            {
                Value = "<<ex: " + ex.Message + ">>";
            }
        }
    }
}
