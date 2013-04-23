using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.IO
{
    public interface IFileSystem
    {
        bool Exists(string path);
        Stream OpenRead(string path);
        Stream OpenWrite(string path);
    }
}
