using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Antlr4.Runtime;
using Antlr4.Runtime.Tree;
using Zeus.Parser;

namespace ZeusfileViewer
{
    class TreeBuilderVisitor : IParseTreeVisitor<ParseTreeNode>
    {
        public ParseTreeNode Visit(IParseTree tree)
        {
            return tree.Accept(this);
        }

        public ParseTreeNode VisitChildren(IRuleNode node)
        {
            string typeName = node.GetType().Name;
            if (!String.IsNullOrEmpty(typeName) && typeName.EndsWith("Context", StringComparison.Ordinal))
            {
                typeName = Char.ToLowerInvariant(typeName[0]) + (typeName.Substring(1, typeName.Length - (1 + "Context".Length)));
            }
            ParseTreeNode treeNode = new ParseTreeNode(typeName);
            for (int i = 0; i < node.ChildCount; i++)
            {
                treeNode.Children.Add(Visit(node.GetChild(i)));
            }
            return treeNode;
        }

        public ParseTreeNode VisitErrorNode(IErrorNode node)
        {
            return VisitTerminal(node);
        }

        public ParseTreeNode VisitTerminal(ITerminalNode node)
        {
            Lexer l = node.Symbol.TokenSource as Lexer;
            string type = "<<UNKNOWN>>";
            if (l != null)
            {
                type = node.Symbol.Type == -1 ? "<<EOF>>" : l.TokenNames[node.Symbol.Type];
            }

            string text;
            try
            {
                text = node.Symbol.Text.Replace("\r", "\\r").Replace("\n", "\\n").Replace("\t", "\\t");
            }
            catch (Exception ex)
            {
                text = "<<ex: " + ex.Message + ">>";
            }

            return new ParseTreeNode(type, text);
        }
    }
}
