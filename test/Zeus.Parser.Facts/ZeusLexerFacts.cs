using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Zeus.Parser.Facts
{
    public class ZeusLexerFacts
    {
        [Fact]
        public void Recognizes_Identifier()
        {
            TestToken("foo", ZeusLexer.IDENTIFIER);
            
        }

        private void TestToken(string text, int type)
        {
            var rdr = new StringReader("foo");
            ZeusLexer l = new ZeusLexer(rdr);
            var tok = l.NextToken();
            Assert.NotNull(tok);
            Assert.Equal(ZeusLexer.IDENTIFIER, tok.Type);
            Assert.Equal("foo", tok.Text);
        }
    }
}
