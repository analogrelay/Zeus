using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Cli.Arguments
{
    public class CommandLineTokenizer
    {
        private static readonly char[] SwitchCharacters = new[] { '/', '-', '–' };
        private static readonly char[] ValueDelimiters = new[] { ':', '=' };

        public IEnumerable<CommandLineToken> Tokenize(string commandLine)
        {
            // Iterate over each character
            var reader = new StringReader(commandLine);
            while (reader.Peek() != -1)
            {
                char current = (char)reader.Peek();
                if (Char.IsWhiteSpace(current))
                {
                    reader.Read();
                }
                else if (SwitchCharacters.Any(c => c == current))
                {
                    yield return ParseSwitch(reader);
                }
                else
                {
                    yield return new ArgumentToken(ReadQuotedOrUnquoted(reader));   
                }
            }
        }

        private string ReadQuotedOrUnquoted(StringReader reader)
        {
            string value;
            char current = (char)reader.Peek();
            if (current == '"' || current == '\'')
            {
                value = ReadQuoted(reader, current);
            }
            else if (current == '“' || current == '”')
            {
                value = ReadQuoted(reader, '“', '”');
            }
            else
            {
                value = ReadUnquoted(reader);
            }
            return value;
        }

        private CommandLineToken ParseSwitch(StringReader reader)
        {
            // special case: "--"
            char current = (char)reader.Read();
            if (current == '-' && reader.Peek() == '-')
            {
                reader.Read();
            }

            string name = ReadWhile(reader, c => !Char.IsWhiteSpace(c) && !ValueDelimiters.Any(c1 => c == c1), allowEscape: false);
            if (reader.Peek() != -1)
            {
                if (!Char.IsWhiteSpace((char)reader.Peek()))
                {
                    // Value delimiter! It's a '/foo:bar', '/foo=bar', etc.
                    string value = null;
                    reader.Read();
                    if (reader.Peek() != -1)
                    {
                        string value = ReadQuotedOrUnquoted(reader);
                    }
                }
                else
                {
                    // _might_ be a value, if the next item
                }
            }
            bool value = true;
            if (name.Length > 1 && name.EndsWith("-"))
            {
                value = false;
                name = name.Substring(0, name.Length - 1);
            }
            return new SwitchToken(name, value);
        }

        private string ReadQuoted(TextReader reader, char quote, char? altQuote = null)
        {
            // Skip the quote
            reader.Read();

            // Read the content
            string content = ReadWhile(reader, c => (quote != c && (altQuote == null || altQuote.Value != c)), allowEscape: true);

            if (reader.Peek() == quote || (altQuote != null && reader.Peek() == altQuote.Value))
            {
                reader.Read();
            }

            return content;
        }

        private string ReadUnquoted(TextReader reader)
        {
            return ReadWhile(reader, c => !Char.IsWhiteSpace(c), allowEscape: false);
        }

        private string ReadWhile(TextReader reader, Func<char, bool> condition, bool allowEscape)
        {
            StringBuilder builder = new StringBuilder();
            while (reader.Peek() != -1 && condition((char)reader.Peek()))
            {
                char c = (char)reader.Read();
                if (c == '\\' && reader.Peek() != -1 && (!condition((char)reader.Peek()) || reader.Peek() == '\\'))
                {
                    builder.Append((char)reader.Read());
                }
                else
                {
                    builder.Append(c);
                }

            }
            return builder.ToString();
        }

        private enum ParserState
        {
            Start
        }
    }
}
