using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zeus.IO;
using Zeus.Serialization;

namespace Zeus
{
    /// <summary>
    /// Represents the context for a zeus command.
    /// </summary>
    /// <remarks>
    /// Specifically this class represents the Zeusfile and Zeus Repositories being used.
    /// </remarks>
    public class ZeusContext
    {
        private readonly string _zeusfilePath;

        public string WorkingDirectory { get; private set; }
        public Zeusfile Zeusfile { get; private set; }

        private IFileSystem FileSystem { get; set; }
        private IZeusfileSerializer Serializer { get; set; }
        
        public ZeusContext(string workingDirectory) : this(workingDirectory, new PhysicalFileSystem(), new ZeusfileJsonSerializer()) { }
        public ZeusContext(string workingDirectory, IFileSystem fileSystem, IZeusfileSerializer serializer)
        {
            WorkingDirectory = workingDirectory;
            FileSystem = fileSystem;
            Serializer = serializer;

            _zeusfilePath = Path.Combine(WorkingDirectory, "Zeusfile");

            LoadZeusfile();
        }

        public void SaveChanges()
        {
            using (var stream = FileSystem.OpenWrite(_zeusfilePath))
            {
                Serializer.Write(Zeusfile, stream);
            }
        }

        private void LoadZeusfile()
        {
            if (FileSystem.Exists(_zeusfilePath))
            {
                // Load the Zeusfile
                using (var stream = FileSystem.OpenRead(_zeusfilePath))
                {
                    Zeusfile = Serializer.Read(stream);
                }
            }
            else
            {
                // Initialize an empty Zeusfile
                Zeusfile = new Zeusfile();
            }
        }
    }
}
