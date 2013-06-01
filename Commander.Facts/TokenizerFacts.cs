using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Commander.Facts
{
    public class TokenizerFacts
    {
        public class TheConstructor
        {
            [Fact]
            public void GivenNoSwitchPrefixes_ItShouldInitializeTheSwitchPrefixesProperty()
            {
                // Act
                var tokenizer = new Tokenizer();

                // Assert
                Assert.Equal(new[] { "--", "-", "/" }, tokenizer.SwitchPrefixes);
            }

            [Fact]
            public void GivenSwitchPrefixes_ItShouldInitializeTheSwitchPrefixesProperty()
            {
                string[] expected = new [] { "!", "?", "$" };

                // Act
                var tokenizer = new Tokenizer(expected);

                // Assert
                Assert.Equal(expected, tokenizer.SwitchPrefixes);
            }
        }

        public class Tokenize
        {
            [Fact]
            public void GivenNullArray_ItShouldThrowArgNull()
            {
                var ex = Assert.Throws<ArgumentNullException>(() => new Tokenizer().Tokenize(null));
                Assert.Equal("args", ex.ParamName);
            }

            [Fact]
            public void GivenEmptyArray_ItShouldReturnEmptyEnumerable()
            {
                Assert.Empty(new Tokenizer().Tokenize(new string[0]));
            }
        }
    }
}
