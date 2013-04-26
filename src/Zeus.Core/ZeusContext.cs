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
        private const string ZeusfileName = "Zeusfile";

        public string WorkingDirectory { get; private set; }
        public Zeusfile Zeusfile { get; private set; }
        public string ZeusRoot { get; private set; }

        private IFileSystem FileSystem { get; set; }
        private IZeusfileSerializer Serializer { get; set; }
        
        public ZeusContext(string workingDirectory) : this(workingDirectory, new PhysicalFileSystem(), new ZeusfileJsonSerializer()) { }
        public ZeusContext(string workingDirectory, IFileSystem fileSystem, IZeusfileSerializer serializer)
        {
            WorkingDirectory = workingDirectory;
            FileSystem = fileSystem;
            Serializer = serializer;

            LoadZeusfile();
        }

        public void SaveChanges()
        {
            using (var stream = FileSystem.OpenWrite(Path.Combine(ZeusRoot, ZeusfileName)))
            {
                Serializer.Write(Zeusfile, stream);
            }
        }

        private void LoadZeusfile()
        {
            // Find the Zeusfile
            ZeusRoot = WorkingDirectory;
            string zeusfilePath = null;
            while (
                !String.IsNullOrEmpty(ZeusRoot) && 
                !FileSystem.Exists(zeusfilePath = Path.Combine(ZeusRoot, ZeusfileName))) {
                ZeusRoot = Path.GetDirectoryName(ZeusRoot);
            }

            if (FileSystem.Exists(zeusfilePath))
            {
                // Load the Zeusfile
                using (var stream = FileSystem.OpenRead(zeusfilePath))
                {
                    Zeusfile = Serializer.Read(stream);
                }
            }
            else
            {
                // Set the original working directory as our Zeus root
                ZeusRoot = WorkingDirectory;
                
                // Initialize an empty Zeusfile
                Zeusfile = new Zeusfile();
            }
        }
    }
}
