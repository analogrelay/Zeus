using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Antlr4.Runtime.Tree;
using Zeus.Parser;

namespace QuickParse
{
    public class IndentingTreeWriter : ZeusfileParserBaseVisitor<string>
    {
        private int _indent = 0;

        public override string VisitRole(ZeusfileParser.RoleContext context)
        {
            return HandleNode(context, "role");
        }

        public override string VisitService_block(ZeusfileParser.Service_blockContext context)
        {
            return HandleNode(context, "service_block");
        }

        public override string VisitStatement(ZeusfileParser.StatementContext context)
        {
            return HandleNode(context, "statement");
        }

        public override string VisitBlock(ZeusfileParser.BlockContext context)
        {
            return HandleNode(context, "block");
        }

        public override string VisitUses_statement(ZeusfileParser.Uses_statementContext context)
        {
            return HandleNode(context, "uses_statement");
        }

        public override string VisitZeusfile_statement(ZeusfileParser.Zeusfile_statementContext context)
        {
            return HandleNode(context, "zeusfile_statement");
        }

        public override string VisitZeusfile(ZeusfileParser.ZeusfileContext context)
        {
            return HandleNode(context, "zeusfile");
        }

        public override string VisitSingle_value(ZeusfileParser.Single_valueContext context)
        {
            return HandleNode(context, "single_value");
        }

        public override string VisitValue(ZeusfileParser.ValueContext context)
        {
            return HandleNode(context, "value");
        }

        public override string VisitResource(ZeusfileParser.ResourceContext context)
        {
            return HandleNode(context, "resource");
        }

        public override string VisitName(ZeusfileParser.NameContext context)
        {
            return HandleNode(context, "name");
        }

        public override string VisitName_part(ZeusfileParser.Name_partContext context)
        {
            return HandleNode(context, "name_part");
        }

        public override string VisitResource_definition(ZeusfileParser.Resource_definitionContext context)
        {
            return HandleNode(context, "resource_definition");
        }

        public override string VisitSubresource_block(ZeusfileParser.Subresource_blockContext context)
        {
            return HandleNode(context, "subresource_block");
        }

        public override string VisitId_or_keyword(ZeusfileParser.Id_or_keywordContext context)
        {
            return HandleNode(context, "id_or_keyword");
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
