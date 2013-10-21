using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using Antlr4.Runtime;
namespace Zeus.Parser.Internal
{
    partial class ZeusLexer
    {
        private Stack<IndentContext> _indents = new Stack<IndentContext>();
        private int _linePos = 0;
        private Queue<IToken> _tokenQueue = new Queue<IToken>();

        public ZeusLexer(TextReader reader) : this(new LatestAntlrInputStream(reader)) {
            _indents.Push(new IndentContext() { Level = 0 });
        }

        public override void Emit(IToken token)
        {
            base.Emit(token);
            if (token.Type != Eof)
            {
                _tokenQueue.Enqueue(token);
            }
        }

        public override IToken NextToken()
        {
            IToken tok = base.NextToken();
            if (_tokenQueue.Count == 0 && _indents.Count > 0)
            {
                // End of file, but need to clear indents
                while (_indents.Count > 1)
                {
                    _indents.Pop();
                    Type = DEDENT;
                    Text = "";
                    Emit();
                }
            }
            if(_tokenQueue.Count == 0)
            {
                // EOF!
                return EmitEOF();
            }
            return _tokenQueue.Dequeue();
        }

        private int GetLineRelativePosition(int pos)
        {
            return pos - _linePos;
        }

        private void HandleEol()
        {
            Type = EOL;
            Emit();
            int next = InputStream.La(1);
            if (next > 0 && !Char.IsWhiteSpace((char)next))
            {
                // Process dedents
                HandleIndent(0);
            }
        }

        private void HandleIndent()
        {
            var text = Text.Replace("\t", "    ");
            int cur = Text == null ? 0 : Text.Length;
            HandleIndent(cur);
        }

        private void HandleIndent(int currentLevel)
        {
            IndentContext indent = _indents.Peek();
            if (currentLevel == indent.Level)
            {
                // Same indent level
                Skip();
            }
            else if (currentLevel > indent.Level)
            {
                // Higher indent level
                _indents.Push(new IndentContext() { Line = Line, Column = Column, Index = CharIndex, Level = currentLevel });
                Type = INDENT;
                Emit();
            }
            else if (currentLevel < indent.Level)
            {
                // Pop until we find the value or would pop 0
                do
                {
                    _indents.Pop();
                    Type = DEDENT;
                    Emit();
                    indent = _indents.Peek();
                } while (indent.Level != 0 && indent.Level > currentLevel);
                if (indent.Level != currentLevel && indent.Level != 0)
                {
                    // No matching dedent!
                    GetErrorListenerDispatch().SyntaxError(
                        this, 
                        0, 
                        Line, 
                        Column,
                        FormatDedentErrorMessage(indent.Line, indent.Column, indent.Level, currentLevel, Line, Column),
                        null);
                }
            }
        }

        private string FormatDedentErrorMessage(int line, int column, int level, int foundLevel, int currentLine, int currentColumn)
        {
            return String.Format(CultureInfo.CurrentCulture,
                Strings.NoMatchingDedent,
                line, column, level, foundLevel, currentLine, currentColumn);
        }

        private struct IndentContext
        {
            public int Line { get; set; }
            public int Column { get; set; }
            public int Index { get; set; }
            public int Level { get; set; }
        }
    }
}
