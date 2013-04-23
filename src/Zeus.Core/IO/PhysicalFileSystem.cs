using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Zeus.IO
{
    public class PhysicalFileSystem : IFileSystem
    {
        public bool Exists(string path)
        {
            return File.Exists(path);
        }

        public Stream OpenRead(string path)
        {
            return new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
        }

        public Stream OpenWrite(string path)
        {
            return new FileStream(path, FileMode.Create, FileAccess.ReadWrite, FileShare.None);
        }
    }
}
