using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Antlr4.Runtime.Tree;
using Zeus.Parser;

namespace QuickParse
{
    public class IndentingTreeWriter : ZeusParserBaseBaseVisitor<string>
    {
        private int _indent = 0;

        public override string VisitCompilation_unit(ZeusParserBase.Compilation_unitContext context)
        {
            return HandleNode(context, "compilation_unit");
        }

        public override string VisitSingle_value(ZeusParserBase.Single_valueContext context)
        {
            return HandleNode(context, "single_value");
        }

        public override string VisitValue(ZeusParserBase.ValueContext context)
        {
            return HandleNode(context, "value");
        }

        public override string VisitResource(ZeusParserBase.ResourceContext context)
        {
            return HandleNode(context, "resource");
        }

        public override string VisitName(ZeusParserBase.NameContext context)
        {
            return HandleNode(context, "name");
        }

        public override string VisitName_part(ZeusParserBase.Name_partContext context)
        {
            return HandleNode(context, "name_part");
        }

        public override string VisitResource_list(ZeusParserBase.Resource_listContext context)
        {
            return HandleNode(context, "resource_list");
        }

        public override string VisitResource_definition(ZeusParserBase.Resource_definitionContext context)
        {
            return HandleNode(context, "resource_definition");
        }

        public override string VisitSubresource_block(ZeusParserBase.Subresource_blockContext context)
        {
            return HandleNode(context, "subresource_block");
        }

        public override string VisitTerminal(ITerminalNode node)
        {
            return String.Concat(
                new String('-', _indent),
                node.Symbol.Type == -1 ? "<EOF>" : ZeusLexer.tokenNames[node.Symbol.Type],
                ":",
                node.Symbol.Text.Replace("\r", "\\r").Replace("\n", "\\n"));
        }

        public override string VisitErrorNode(IErrorNode node)
        {
            return String.Concat(
                new String('-', _indent),
                "ERROR!",
                node.GetText());
        }

        protected override string AggregateResult(string aggregate, string nextResult)
        {
            return String.Concat(aggregate, Environment.NewLine, nextResult);
        }

        private string HandleNode(IRuleNode target, string name)
        {
            return HandleNode(target, b => b.Append(name));
        }

        private string HandleNode(IRuleNode target, Action<StringBuilder> nodeWriter)
        {
            StringBuilder bld = new StringBuilder();
            bld.Append(new String('-', _indent));
            nodeWriter(bld);
            _indent++;
            bld.Append(VisitChildren(target));
            _indent--;
            return bld.ToString();
        }
    }
}
