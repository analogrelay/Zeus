using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Zeus.Serialization
{
    public interface IZeusfileSerializer
    {
        void Write(Zeusfile file, Stream destination);
        Zeusfile Read(Stream source);
    }

    public static class ZeusfileSerializerExtensions
    {
        public static void Write(this IZeusfileSerializer self, Zeusfile file, string fileName)
        {
            using (var stream = File.OpenWrite(fileName))
            {
                self.Write(file, stream);
            }
        }

        public static Zeusfile Read(this IZeusfileSerializer self, string fileName)
        {
            using (var stream = File.OpenRead(fileName))
            {
                return self.Read(stream);
            }
        }
    }
}
