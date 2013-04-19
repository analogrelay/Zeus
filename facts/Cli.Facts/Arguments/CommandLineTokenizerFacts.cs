using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Xunit.Extensions;

namespace Cli.Arguments
{
    public class CommandLineTokenizerFacts
    {
        public class TheTokenizeMethod
        {
            [Theory]
            [InlineData("justoneword")]
            [InlineData("with-a-dash")]
            [InlineData("equals=A-OK")]
            public void GivenUnquotedArgumentsWithNoPrefix_ItShouldReturnArgumentTokens(string argument)
            {
                // Arrange
                var tokenizer = new CommandLineTokenizer();

                // Act
                var tokens = tokenizer.Tokenize(argument + " EndOfLine");

                // Assert
                Assert.Equal(new CommandLineToken[] {
                    new ArgumentToken(argument),
                    new ArgumentToken("EndOfLine")
                }, tokens.ToArray());
            }

            [Theory]
            [InlineData("\"lots of words are just fine\"", "lots of words are just fine")]
            [InlineData("\"different ' terminator?\"", "different ' terminator?")]
            [InlineData("\"no terminator? just keeps going", "no terminator? just keeps going")]
            [InlineData("\'single quotes? you got it!\'", "single quotes? you got it!")]
            [InlineData("\'different \" terminator?\'", "different \" terminator?")]
            [InlineData("\'no terminator? still OK", "no terminator? still OK")]
            [InlineData("“copied from word, did you?“", "copied from word, did you?")]
            [InlineData("”it happens.”", "it happens.")]
            [InlineData("“got you covered”", "got you covered")]
            [InlineData("”either way“", "either way")]
            [InlineData("\"escape \\\"velocity \\\\ achieved\"", "escape \"velocity \\ achieved")]
            [InlineData("\'escape \\\'velocity \\\\ achieved\'", "escape \'velocity \\ achieved")]
            [InlineData("“escape \\“velocity \\\\ achieved”", "escape “velocity \\ achieved")]
            [InlineData("“escape \\”velocity \\\\ achieved”", "escape ”velocity \\ achieved")]
            public void GivenQuotedArgumentsWithNoPrefix_ItShouldReturnArgumentTokens(string commandLine, string argumentContent)
            {
                // Arrange
                var tokenizer = new CommandLineTokenizer();

                // Act
                var tokens = tokenizer.Tokenize(commandLine);

                // Assert
                Assert.Equal(new CommandLineToken[] {
                    new ArgumentToken(argumentContent)
                }, tokens.ToArray());
            }

            [Theory]
            [InlineData("/slashes", "slashes")]
            [InlineData("-singledashes", "singledashes")]
            [InlineData("--doubledashes", "doubledashes")]
            [InlineData("–YouCopiedFromWordAgainDidntYou", "YouCopiedFromWordAgainDidntYou")]
            public void GivenArgumentsWithSwitchPrefixes_ItShouldReturnSwitchTokens(string argument, string name)
            {
                // Arrange
                var tokenizer = new CommandLineTokenizer();

                // Act
                var tokens = tokenizer.Tokenize(argument + " EndOfLine");

                // Assert
                Assert.Equal(new CommandLineToken[] {
                    new SwitchToken(name, value: true),
                    new ArgumentToken("EndOfLine")
                }, tokens.ToArray());
            }

            [Theory]
            [InlineData("/slashes-", "slashes")]
            [InlineData("-singledashes-", "singledashes")]
            [InlineData("--doubledashes-", "doubledashes")]
            [InlineData("–YouCopiedFromWordAgainDidntYou-", "YouCopiedFromWordAgainDidntYou")]
            public void GivenArgumentsWithSwitchPrefixesAndMinusSuffixes_ItShouldReturnSwitchTokensWithFalseValues(string argument, string name)
            {
                // Arrange
                var tokenizer = new CommandLineTokenizer();

                // Act
                var tokens = tokenizer.Tokenize(argument + " EndOfLine");

                // Assert
                Assert.Equal(new CommandLineToken[] {
                    new SwitchToken(name, value: false),
                    new ArgumentToken("EndOfLine")
                }, tokens.ToArray());
            }

            [Theory]
            [InlineData("/slashes:foo", "slashes", "foo")]
            [InlineData("-singledashes:foo", "singledashes", "foo")]
            [InlineData("--doubledashes:foo", "doubledashes", "foo")]
            [InlineData("–YouCopiedFromWordAgainDidntYou:foo", "YouCopiedFromWordAgainDidntYou", "foo")]
            public void GivenArgumentsWithSwitchPrefixesAndColonValues_ItShouldReturnParameterTokensWithValues(string argument, string name, string value)
            {
                // Arrange
                var tokenizer = new CommandLineTokenizer();

                // Act
                var tokens = tokenizer.Tokenize(argument + " EndOfLine");

                // Assert
                Assert.Equal(new CommandLineToken[] {
                    new ParameterToken(name, value),
                    new ArgumentToken("EndOfLine")
                }, tokens.ToArray());
            }
        }
    }
}
