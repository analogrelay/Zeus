using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Zeus.Serialization.Surrogates;

namespace Zeus.Serialization
{
    public class ZeusfileJsonSerializer : IZeusfileSerializer
    {
        private readonly JsonSerializer _serializer = new JsonSerializer()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore,
            DefaultValueHandling = DefaultValueHandling.Ignore,
            DateFormatHandling = DateFormatHandling.IsoDateFormat,
            Formatting = Formatting.Indented,
            TypeNameHandling = TypeNameHandling.None
        };

        public void Write(Zeusfile file, Stream destination)
        {
            if (file == null)
            {
                throw new ArgumentNullException("file");
            }

            if (destination == null)
            {
                throw new ArgumentNullException("destination");
            }

            if (!destination.CanWrite)
            {
                throw new InvalidOperationException(Resources.CannotWriteFileToReadOnlyStream);
            }

            using (JsonTextWriter writer = new JsonTextWriter(new StreamWriter(destination)))
            {
                Write(file, writer);
            }
        }

        public Zeusfile Read(Stream source)
        {
            if (source == null)
            {
                throw new ArgumentNullException("source");
            }

            if (!source.CanRead)
            {
                throw new InvalidOperationException(Resources.CannotReadFileFromWriteOnlyStream);
            }

            using (JsonTextReader reader = new JsonTextReader(new StreamReader(source)))
            {
                return Read(reader);
            }
        }

        private Zeusfile Read(JsonReader reader)
        {
            return _serializer.Deserialize<ZeusfileSurrogate>(reader).ToZeusfile();
        }

        private void Write(Zeusfile file, JsonWriter writer)
        {
            _serializer.Serialize(writer, new ZeusfileSurrogate(file));
        }
    }
}
