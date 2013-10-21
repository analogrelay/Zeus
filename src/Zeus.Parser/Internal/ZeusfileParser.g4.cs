namespace Zeus.Parser.Internal
{
    partial class ZeusfileParser
    {
        protected object CombineValues(object left, object right)
        {
            return ParserHelper.CombineValues(left, right);
        }

        protected object ParseNumber(string number)
        {
            return ParserHelper.ParseNumber(number);
        }

        protected string ReadQuotedString(string quoted)
        {
            return ParserHelper.ReadQuotedString(quoted);
        }
    }
}
