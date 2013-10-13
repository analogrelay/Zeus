using System;
using System.Collections.Generic;
using System.IO.Abstractions.TestingHelpers;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Zeus.PowerShell.Commands;

namespace Zeus.PowerShell.Facts.Commands
{
    public class GetServiceModelFacts
    {
        [Fact]
        public void GivenNoArguments_ItReturnsEmptyIfNoZeusfileInCurrentDirectory()
        {
            // Arrange
            var mockFs = new MockFileSystem(new Dictionary<string, MockFileData>());
            var cmd = new GetServiceModel(mockFs);

            // Act
            var results = cmd.Invoke();

            // Assert
            Assert.Empty(results);
        }

        [Fact]
        public void GivenDirectoryWithNoZeusfile_ItReturnsEmptyIfNoZeusfileInCurrentDirectory()
        {
            // Arrange
            var mockFs = new MockFileSystem(new Dictionary<string, MockFileData>());
            var cmd = new GetServiceModel(mockFs)
            {
                Path = @"C:\Nothing\Here"
            };

            // Act
            var results = cmd.Invoke();

            // Assert
            Assert.Empty(results);
        }

        [Fact]
        public void GivenPathToZeusfile_ItReturnsEmptyIfFileDoesNotExist()
        {
            // Arrange
            var mockFs = new MockFileSystem(new Dictionary<string, MockFileData>());
            var cmd = new GetServiceModel(mockFs)
            {
                Path = @"C:\Nothing\Here\Zeusfile"
            };

            // Act
            var results = cmd.Invoke();

            // Assert
            Assert.Empty(results);
        }
    }
}
